

import { NextResponse } from "next/server";
import { db } from "@/lib/db";


export async function GET(req: Request, { params }: { params: { communityId: string } }) {
    try {
        const { communityId } = params;
        
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

        const data = await db.post.findMany({
            where: {
                communityId
            },
        })

        return NextResponse.json({
            success: true,
            data,
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