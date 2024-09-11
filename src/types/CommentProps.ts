import { Vote } from "@prisma/client";

export type CommentProps = {
  id: string;
  content: string;
  createdAt: Date;
  commentId: string | null;
  parentComment?: CommentProps | null;
  commentOwner?: {
    name: string | null;
    image: string  | null;
  };
  votes?: Vote[];
  children?: CommentProps[];
};