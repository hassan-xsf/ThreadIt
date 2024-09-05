import { z } from 'zod'

enum TypeEnum {
    Upvote = 'Upvote',
    Downvote = 'Downvote',
}

export const voteSchema = z.object({
    type: z.nativeEnum(TypeEnum),
    commentId: z.string().optional(),
    postId: z.string().optional(),
}); 