import { Community, Post, User, Vote } from "@prisma/client";
import { CommentProps } from "./CommentProps";


export type PostResponse = Post & {
    community: Community
    User: User,
    votes: Vote[]
    comments: CommentProps[]
    _count?: {
        comments: number
    }
} 