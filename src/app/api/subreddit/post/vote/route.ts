import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { PostVoteValidator } from "@/lib/validators/vote"
import { NextResponse } from "next/server"

const CACHE_AFTER_UPVOTES = 1

export async function PATCH(req: Request) {
    try {
        const body = req.json()

        const { postId, voteType } = PostVoteValidator.parse(body)
        const session = await getAuthSession()

        if (!session?.user) {
            return new NextResponse("Unauthorized", {
                status: 401
            })
        }

        const exisitingVote = await db.vote.findFirst({
            where: {
                userId: session.user.id,
                postId
            }
        })

        const post = await db.post.findUnique({
            where: {
                id: postId
            },
            include: {
                author: true,
                votes: true
            }
        })

        if (!post) {
            return new NextResponse("Post not found", {
                status: 404
            })
        }

        if (exisitingVote) {
            if (exisitingVote.type === voteType) {
                await db.vote.delete({
                    where: {
                        userId_postId: {
                            postId,
                            userId: session.user.id
                        }
                    }
                })

                return new NextResponse("Vote removed", {
                    status: 200
                })
            }

            await db.vote.update({
                where: {
                    userId_postId: {
                        postId,
                        userId: session?.user.id
                    }
                },
                data: {
                    type: voteType
                }
            })
            // recount the votes
            const votesAmt = post.votes.reduce((acc, vote) => {
                if (vote.type === "UP") return acc + 1
                if (vote.type === "DOWN") return acc - 1
                return acc
            }, 0)

            if (votesAmt >= CACHE_AFTER_UPVOTES) {
                const cachePayload = {}
            }
        }
    } catch (error) {

    }
}