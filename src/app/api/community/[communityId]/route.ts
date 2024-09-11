

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";


export async function GET(request: NextRequest, { params }: { params: { communityId: string } }) {
    const communityId = params.communityId

    try {
        console.log(communityId)
        
        if (!communityId) {
            return NextResponse.json({
                success: false,
                message: "Invalid community ID!",
            },
                { status: 400 }
            );
        }
        const session = await getAuthSession();  
        const communityExists = await db.community.findFirst({
            where: {
                id: communityId
            },
            select: {
                id: true,
                name: true,
                banner: true,
                profile: true,
                description: true,
                createdAt: true,
                _count: {
                  select: { members: true }, 
                },
              },
        })
        if (!communityExists) {
            return NextResponse.json({
                success: false,
                message: "Invalid community ID!",
            },
                { status: 400 }
            );
        }
        const data = await db.post.findMany({
            where: {
                communityId
            },
            select: {
                id: true,
                heading: true,
                content: true,
                postImage: true,
                createdAt: true,
                User: {
                    select: {
                        name: true,
                        image: true,
                    }
                },
                votes: true,
                comments: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        commentId: true,
                        parentComment: true,
                        commentOwner: {
                            select: {
                                name: true,
                                image: true,
                            }
                        },
                        votes: true,

                        // First level of children
                        children: {
                            select: {
                                id: true,
                                content: true,
                                createdAt: true,
                                commentId: true,
                                parentComment: true,
                                commentOwner: {
                                    select: {
                                        name: true,
                                        image: true,
                                    }
                                },
                                votes: true,

                                // Second level of children (children of children)
                                children: {
                                    select: {
                                        id: true,
                                        content: true,
                                        createdAt: true,
                                        commentId: true,
                                        parentComment: true,
                                        commentOwner: {
                                            select: {
                                                name: true,
                                                image: true,
                                            }
                                        },
                                        votes: true,

                                        // Third level of children (children of children of children)
                                        children: {
                                            select: {
                                                id: true,
                                                content: true,
                                                createdAt: true,
                                                commentId: true,
                                                parentComment: true,
                                                commentOwner: {
                                                    select: {
                                                        name: true,
                                                        image: true,
                                                    }
                                                },
                                                votes: true,
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                },
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        let isJoined = false;

        if(session) {
            const joinedComs = await db.user.findFirst({
                where: {
                    id: session.user.id,
                },
                include: {
                    joinedCommunities: true,
                },
            })
            if(joinedComs?.joinedCommunities) isJoined = joinedComs!.joinedCommunities.some(community => community.id === communityId);
        }

        return NextResponse.json({
            success: true,
            data: {c: communityExists , isjoined: isJoined , posts: data},
            message: "Community posts have been retrieved.."
        },
            { status: 201 }
        );

    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: "There was a problem retreiving the community posts, Please try again later.",
        },
            { status: 500 }
        );


    }

}