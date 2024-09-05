import { communitySchema } from "@/schemas/communitySchema";
import { NextResponse } from "next/server";
import { z, ZodError } from 'zod'
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";


export async function POST(req: Request) {

    try {

        const formData = await req.formData();
        const body = {
            name: formData.get('name'),
            banner: formData.get('banner'),
            profile: formData.get('profile'),
        }
        const { name, banner, profile } = communitySchema.parse(body)
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
                name
            }
        })

        if (communityExists) {
            return NextResponse.json({
                success: false,
                message: "Community already exists with this name!",
            },
                { status: 400 }
            );
        }

        let bannerURL: string | undefined, profileURL: string | undefined;
        if (banner.size !== 0) {
            const { secure_url }: { secure_url: string } = await uploadToCloudinary(banner)
            bannerURL = secure_url;
        }
        if (profile.size !== 0) {
            const { secure_url }: { secure_url: string } = await uploadToCloudinary(banner)
            profileURL = secure_url;
        }


        const community = await db.community.create({
            data: {
                name,
                banner: bannerURL || "",
                profile: profileURL || "",
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