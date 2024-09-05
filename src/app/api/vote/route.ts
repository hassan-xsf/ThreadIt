import { voteSchema } from "@/schemas/voteSchema";
import { NextResponse } from "next/server";
import { ZodError } from 'zod'
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";


export async function POST(req: Request) {

    try {
        const body = await req.json()
        const { type, commentId, postId } = voteSchema.parse(body)
        const session = await getAuthSession()

        if (!session?.user) {
            return NextResponse.json({
                success: false,
                message: "You must be logged in inorder to perform this action.",
            },
                { status: 401 }
            );
        }
        if (!commentId && !postId) {
            return NextResponse.json({
                success: false,
                message: "Invalid commentid/postId found",
            },
                { status: 400 }
            );
        }
        if (postId) {
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
        }

        else if (commentId) {
            const commentExists = await db.comment.findFirst({
                where: {
                    id: commentId
                }
            })
            if (!commentExists) {
                return NextResponse.json({
                    success: false,
                    message: "Invalid comment ID!",
                },
                    { status: 400 }
                );
            }
        }

        const post = await db.comment.create({
            data: {
                type: type,
                userId: session.user.id,
                postId: postId ? postId : undefined,
                commentId: commentId ? commentId : undefined
            }

        })

        return NextResponse.json({
            success: true,
            message: "Post has been created succesfully!",
            data: post,
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