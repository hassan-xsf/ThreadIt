import { z } from 'zod'



export const communitySchema = z.object({
    name: z.string().min(3, "Community name must be atleast of 3 characters").max(21, "Community name must not be longer than 21 characters"),
    banner: z.any().optional(),
    profile: z.any().optional(),
    description: z.string().max(201,"Community description must not be longer than 201 characters").optional()
})