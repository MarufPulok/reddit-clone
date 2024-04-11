import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { CommentValidator } from "@/lib/validators/comment"
import { NextResponse } from "next/server"
import { z } from "zod"

export async function PATCH(req: Request) {
    try {
        const body = await req.json()

        const { postId, text, replyToId } = CommentValidator.parse(body)

        const session = await getAuthSession()

        if (!session?.user) return NextResponse.json("Unauthorized", { status: 401 })

        await db.comment.create({
            data: {
                postId,
                text,
                replyToId,
                authorId: session.user.id
            }
        })

        return NextResponse.json("Comment created successfully", { status: 200 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json("Invalid request data passed", { status: 400 })
        }

        return NextResponse.json("Could not comment at this time, please try again later", { status: 500 })
    }
}