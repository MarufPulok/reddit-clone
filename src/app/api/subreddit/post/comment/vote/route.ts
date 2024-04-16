import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { CommentVoteValidator } from "@/lib/validators/vote"
import { NextResponse } from "next/server"
import { z } from "zod"

export async function PATCH(req: Request) {
    try {
        const body = await req.json()

        const { commentId, voteType } = CommentVoteValidator.parse(body)
        const session = await getAuthSession()

        if (!session?.user) {
            return new NextResponse("Unauthorized", {
                status: 401
            })
        }

        const exisitingVote = await db.commentVote.findFirst({
            where: {
                userId: session.user.id,
                commentId
            }
        })

        if (exisitingVote) {
            if (exisitingVote.type === voteType) {
                await db.commentVote.delete({
                    where: {
                        userId_commentId: {
                            commentId,
                            userId: session.user.id
                        }
                    }
                })

                return new NextResponse("Vote removed", {
                    status: 200
                })
            } else {
                await db.commentVote.update({
                    where: {
                        userId_commentId: {
                            commentId,
                            userId: session.user.id
                        }
                    },
                    data: {
                        type: voteType
                    }
                })
                return new NextResponse("Ok", { status: 200 })
            }    
        }

        await db.commentVote.create({
            data: {
                type: voteType,
                userId: session.user.id,
                commentId
            }
        })      

        return new NextResponse("Ok", { status: 200 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse("Invalid request data passed", { status: 422 })
        }

        return new NextResponse("Couldn't register your vote", { status: 500 })
    }
}