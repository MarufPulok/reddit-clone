import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UsernameValidator } from "@/lib/validators/username";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function PATCH(req: Request) {
    try {
        const session = await getAuthSession()

        if (!session?.user) {
            return NextResponse.json("Unauthorized", {
                status: 401
            })
        }

        const body = await req.json()

        const { name } = UsernameValidator.parse(body)

        const username = await db.user.findFirst({
            where: {
                username: name
            }
        })

        if (username) {
            return NextResponse.json("Username is taken", {
                status: 409
            })
        }

        await db.user.update({
            where: {
                id: session.user.id
            },
            data: {
                username: name
            }
        })

        return NextResponse.json("OK", {
            status: 200
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json("Invalid request data passed", {
                status: 422
            })
        }

        return NextResponse.json("Couldn't update username", {
            status: 500
        })
    }
}