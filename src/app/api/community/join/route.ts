
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {

        const body = await req.json();
        const {communityId} : {communityId : string} = body;
        const session = await getAuthSession()

        if (!session?.user) {
            return NextResponse.json({
                success: false,
                message: "You must be logged in inorder to perform this.",
            },
                { status: 401 }
            );
        }
        const communityExists = await db.community.findFirst({
            where: {
                id: communityId
            }
        })
        if (!communityExists) {
            return NextResponse.json({
                success: false,
                message: "Invalid community ID!",
            },
                { status: 400 }
            );
        }

        const joinedComs = await db.user.findFirst({
            where: {
                id: session.user.id,
            },
            include: {
                joinedCommunities: true,
            },
        })

        const isFound = joinedComs!.joinedCommunities.some(community => community.id === communityId);
        if (isFound) {
            await db.user.update({
                where: {
                    id: session.user.id,
                },
                data: {
                    joinedCommunities: {
                        disconnect: { id: communityId },
                    },
                },
                include: {
                    joinedCommunities: true,
                },
            });
        } else {
            await db.user.update({
                where: {
                    id: session.user.id,
                },
                data: {
                    joinedCommunities: {
                        connect: { id: communityId },
                    },
                },
                include: {
                    joinedCommunities: true,
                },
            });
        }

        return NextResponse.json({
            success: true,
            data: {
                isJoined: !isFound,
            },
            message: isFound ? "You have left the community" : "You have joined the community",
        },
            { status: 201 }
        );


    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: "There was a problem following the community, Please try again later.",
        },
            { status: 500 }
        );


    }
}