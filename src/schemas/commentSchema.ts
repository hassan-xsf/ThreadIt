import { z } from 'zod'



export const commentSchema = z.object({
    content: z.string().min(3, "Comment must be atleast of 3 characters").max(201, "Comment must not be longer than 201 characters"),
    postId: z.string().min(1 , "Post not found!"),
    parentCommentId: z.string().optional()
})