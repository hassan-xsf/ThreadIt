import { z } from 'zod'



export const postSchema = z.object({
    heading: z.string().min(3, "Heading must be atleast of 3 characters").max(64, "Heading must not be longer than 64 characters"),
    content: z.string().min(10, "Content must be atleast of 10 characters").max(1024, "Content must not be longer than 1024 characters"),
    postImage: z.any().optional(),
    communityId: z.string().min(1 , "Community not found!").optional()
})