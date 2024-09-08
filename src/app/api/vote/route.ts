import { voteSchema } from "@/schemas/voteSchema";
import { NextResponse } from "next/server";
import { ZodError } from 'zod'
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";


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


        if (postId) {
            const isVoted = await db.vote.findFirst({
                where: {
                    userId: session.user.id,
                    postId: postId,
                }
            })
            if (isVoted) {
                await db.vote.deleteMany({
                    where: {
                        userId: session.user.id,
                        postId: postId,
                    }
                })
            }
            if (isVoted?.type !== type) {
                const vote = await db.vote.create({
                    data: {
                        type: type,
                        userId: session.user.id,
                        postId: postId,
                    }
                })
                const [upvotesCount, downvotesCount] = await db.$transaction([
                    db.vote.count({
                        where: { type: 'Upvote' }
                    }),
                    db.vote.count({
                        where: { type: 'Downvote' }
                    })
                ]);
                return NextResponse.json({
                    success: true,
                    message: vote.type === "Downvote" ? "Post has been downvoted succesfully" : "Post has been upvoted succesfully!",
                    data: { vote: vote, voteType: vote.type , voteCount: upvotesCount - downvotesCount},
                },
                    { status: 201 }
                );
            }
            else {
                const [upvotesCount, downvotesCount] = await db.$transaction([
                    db.vote.count({
                        where: { type: 'Upvote' }
                    }),
                    db.vote.count({
                        where: { type: 'Downvote' }
                    })
                ]);
                
                return NextResponse.json({
                    success: true,
                    message: "Your post upvote/downvote has been removed",
                    data: { vote: null, voteType: type , voteCount: upvotesCount - downvotesCount},
                },
                    { status: 200 }
                );
            }
        }

        else if (commentId) {
            const isVoted = await db.vote.findFirst({
                where: {
                    userId: session.user.id,
                    commentId,
                }
            })
            if (isVoted) {
                await db.vote.deleteMany({
                    where: {
                        userId: session.user.id,
                        commentId
                    }
                })
            }
            if (isVoted?.type !== type) {
                const vote = await db.vote.create({
                    data: {
                        type: type,
                        userId: session.user.id,
                        commentId,
                    }
                })
                return NextResponse.json({
                    success: true,
                    message: vote.type === "Downvote" ? "Comment has been downvoted succesfully" : "Comment has been upvoted succesfully!",
                    data: vote,
                },
                    { status: 201 }
                );
            }
            else {
                return NextResponse.json({
                    success: true,
                    message: "Your comment upvote/downvote has been removed",
                },
                    { status: 200 }
                );
            }
        }


    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({
                success: false,
                message: error.message,
            },
                { status: 400 }
            );
        }
        return NextResponse.json({
            success: false,
            message: "There was a problem creating the community, Please try again later.",
        },
            { status: 500 }
        );


    }

}