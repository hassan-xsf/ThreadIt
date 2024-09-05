import { z } from 'zod'

enum TypeEnum {
    Upvote = 'Upvote',
    Downvote = 'Downvote',
}

export const voteSchema = z.object({
    type: z.enum([TypeEnum.Upvote, TypeEnum.Downvote]),
    commentId: z.string().optional(),
    postId: z.string().optional(),
}); 