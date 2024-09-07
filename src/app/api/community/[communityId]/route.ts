

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function GET(req: Request, { params }: { params: { communityId: string } }) {
    try {
        const { communityId } = params;
        const  session = await getServerSession(authOptions)     
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
        })
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
            isJoined = joinedComs!.joinedCommunities.some(community => community.id === communityId);
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