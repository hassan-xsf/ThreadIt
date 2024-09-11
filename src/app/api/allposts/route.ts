
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";


export async function GET(req : NextRequest) {

    try {
        const { searchParams } = req.nextUrl;

        const feed = searchParams.get('feed') || 'home';
        const skip = parseInt(searchParams.get('skip') || '0')
        const take = parseInt(searchParams.get('take') || '2')

        const session = await getAuthSession()


        let orderBy: Record<any, any> = { createdAt: 'desc' };

        if (feed === 'popular') {
            orderBy =
            {
                votes:
                {
                    _count: 'desc'
                }
            };
        }
        let where = {};

        if (session?.user && feed === 'home') {
            const coms = await db.user.findUnique({
                where: {
                    id: session.user.id,
                },
                select: {
                    joinedCommunities: {
                        select: {
                            id: true,
                        }
                    }
                },
            });
            if (coms?.joinedCommunities?.length) {
                const communityIds = coms.joinedCommunities.map(c => c.id);
                console.log(communityIds);
                where = {
                    communityId: {
                        in: communityIds,
                    },
                };
            }
        }

        const posts = await db.post.findMany({
            orderBy,
            where,
            take: take || 2,
            skip: skip || 0,
            include: {
                community: true,
                User: {
                    select: {
                        name: true,
                        image: true,
                    }
                },
                votes: true,
                _count: {
                    select:
                    {
                        comments: true
                    },
                },
            }
        })
        const totalPosts = await db.post.count({where});
        const hasNextPage = skip + take < totalPosts;
        console.log(totalPosts)
        return NextResponse.json({
            success: true,
            message: "Posts has been retrieved successfully.",
            data: posts,
            nextPage: hasNextPage,
        },
            { status: 201 }
        );


    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: "There was a problem retreiving the posts. Please try again later.",
        },
            { status: 500 }
        );


    }

}