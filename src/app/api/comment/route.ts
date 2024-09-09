import { commentSchema } from "@/schemas/commentSchema";
import { NextResponse } from "next/server";
import { ZodError } from 'zod'
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";


export async function POST(req: Request) {

    try {
        const body = await req.json();
        const { content, postId, parentCommentId } = commentSchema.parse(body)
        const session = await getAuthSession()

        if (!session?.user) {
            return NextResponse.json({
                success: false,
                message: "You must be logged in inorder to perform this action.",
            },
                { status: 401 }
            );
        }
        const postExists = await db.post.findFirst({
            where: {
                id: postId
            }
        })

        if (!postExists) {
            return NextResponse.json({
                success: false,
                message: "Invalid post ID!",
            },
                { status: 400 }
            );
        }
        const comment = await db.comment.create({
            data: {
                content,
                postId,
                userId: session.user.id,
                commentId: parentCommentId || null,
            }

        })

        return NextResponse.json({
            success: true,
            message: "Comment has been created succesfully!",
            data: comment,
        },
            { status: 201 }
        );


    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({
                success: false,
                message: error.message,
            },
                { status: 400 }
            );
        }
        console.log(error)
        return NextResponse.json({
            success: false,
            message: "There was a problem creating the community, Please try again later.",
        },
            { status: 500 }
        );


    }

}