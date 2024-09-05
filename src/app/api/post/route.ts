import { postSchema } from "@/schemas/postSchema";
import { NextResponse } from "next/server";
import { z, ZodError } from 'zod'
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";


export async function POST(req: Request) {

    try {
        const formData = await req.formData();
        const body = {
            heading: formData.get('heading'),
            content: formData.get('content'),
            postImage: formData.get('postImage'),
            communityId: formData.get('communityId'),
        }
        const { heading, content, communityId , postImage } = postSchema.parse(body)
        const session = await getAuthSession()

        if (!session?.user) {
            return NextResponse.json({
                success: false,
                message: "You must be logged in inorder to perform this action.",
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

        let postImageURL: string | undefined, profileURL: string | undefined;
        if (postImage.size !== 0) {
            const { secure_url }: { secure_url: string } = await uploadToCloudinary(postImage)
            postImageURL = secure_url;
        }


        const post = await db.post.create({
            data: {
                heading,
                content,
                postImage: postImageURL,
                // postOwnerId: session.user.id;
            }

        })

        return NextResponse.json({
            success: true,
            message: "Community has been created succesfully!",
            data: community,
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