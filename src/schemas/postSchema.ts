import { z } from 'zod'



export const postSchema = z.object({
    heading: z.string().min(3, "Heading must be atleast of 3 characters").max(15, "Heading must not be longer than 15 characters"),
    content: z.string().min(10, "Content must be atleast of 10 characters").max(201, "Content must not be longer than 201 characters"),
    postImage: z.any().optional(),
    communityId: z.string().min(1 , "Community not found!").optional()
})