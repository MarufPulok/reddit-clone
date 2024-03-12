import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { redis } from "@/lib/redis"
import { PostVoteValidator } from "@/lib/validators/vote"
import { CachedPost } from "@/types/redis"
import { NextResponse } from "next/server"
import { z } from "zod"

const CACHE_AFTER_UPVOTES = 1

export async function PATCH(req: Request) {
    try {
        const body = await req.json()

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
                const cachePayload: CachedPost = {
                    authorUsername: post.author.username ?? "",
                    content: JSON.stringify(post.content),
                    id: post.id,
                    title: post.title,
                    currentVote: voteType,
                    createdAt: post.createdAt
                }

                await redis.hset(`post:${postId}`, cachePayload)
            }

            return new NextResponse("Ok", { status: 200 })
        }

        await db.vote.create({
            data: {
                type: voteType,
                userId: session.user.id,
                postId
            }
        })
        const votesAmt = post.votes.reduce((acc, vote) => {
            if (vote.type === "UP") return acc + 1
            if (vote.type === "DOWN") return acc - 1
            return acc
        }, 0)

        if (votesAmt >= CACHE_AFTER_UPVOTES) {
            const cachePayload: CachedPost = {
                authorUsername: post.author.username ?? "",
                content: JSON.stringify(post.content),
                id: post.id,
                title: post.title,
                currentVote: voteType,
                createdAt: post.createdAt
            }

            await redis.hset(`post:${postId}`, cachePayload)
        }

        return new NextResponse("Ok", { status: 200 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse("Invalid request data passed", { status: 422 })
        }

        return new NextResponse("Couldn't register your vote", { status: 500 })
    }
}