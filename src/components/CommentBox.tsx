"use client"

import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { comment as commentService } from '@/services/comment';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import UserAvatar from './UserAvatar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Votes from './Votes';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import timeAgo from '@/lib/timeAgo';
import { CommentProps } from '@/types/CommentProps';


const submitCommentSchema = z.object({
    content: z.string().min(3, "Comment must be atleast of 3 characters").max(201, "Comment must not be longer than 201 characters"),
})

const CommentBox = ({ postId, initialComments }: { postId: string, initialComments: CommentProps[] }) => {

    const [showReplyInput, setShowReplyInput] = useState(false);

    const { data: session } = useSession();

    const router = useRouter();

    const { handleSubmit: handleCommentSubmit, register: commentRegister, formState: { errors: commentErrors }, reset: resetComment } = useForm({
        resolver: zodResolver(submitCommentSchema),
        defaultValues: {
            content: "",
        },
    });


    const { mutate: commentMutate, isPending } = useMutation({
        mutationFn: commentService,
        onSuccess: () => {
            toast.success("Commented successfully!")
            router.refresh();

        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message)
            }
            console.log(error)
        }
    })
    const onComment = (e: z.infer<typeof submitCommentSchema>) => {
        if (!session || !session.user) {
            return router.push("/sign-in")
        }
        if (isPending) return;
        commentMutate({ content: e.content, postId });
        resetComment();
    }
    return (
        <div className="px-4 pb-4">
            <form onSubmit={handleCommentSubmit(onComment)} className="flex items-end flex-col">
                <Input {...commentRegister('content')} disabled={isPending} minLength={3} maxLength={201} placeholder="Add a comment..." onFocus={() => setShowReplyInput(true)} className="placeholder:text-gray-500 mb-4 rounded-xl" />
                {commentErrors.content && <p className="text-xs text-red-600 self-start">{commentErrors.content.message}</p>}
                {showReplyInput &&
                    <div className="flex gap-2">
                        <Button type="submit" disabled={isPending} onClick={() => session?.user && setShowReplyInput(false)} size="sm" className="rounded-full mt-2 bg-gray-200 dark text-black">Cancel</Button>
                        <Button disabled={isPending} size="sm" className="rounded-full mt-2 bg-[#96401b] hover:bg-[#96401b] text-white ">{isPending ? "Commenting..." : "Comment"}</Button>
                    </div>
                }
            </form>

            {initialComments && initialComments.map(comment => (
                (comment.parentComment === null) && <CommentComponent key={comment.id} postId={postId} comment={comment} />
            ))}
        </div>
    )
}



const CommentComponent = ({ postId, comment, depth = 0 }: { postId: string, comment: CommentProps; depth?: number }) => {

    const router = useRouter();
    
    // if(comment.parentComment !== null && depth == 0) return;

    const { handleSubmit: handleReply, register: replyRegister, formState: { errors: replyError }, reset: resetReply } = useForm({
        resolver: zodResolver(submitCommentSchema),
        defaultValues: {
            content: "",
        },
    });

    const [showReplyInput, setShowReplyInput] = useState(false);


    const { mutate: replyMutate, isPending } = useMutation({
        mutationFn: commentService,
        onSuccess: (res) => {
            toast.success("Replied successfully!")
            router.refresh();

        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message)
            }
            console.log(error)
        }
    })

    const onReply = (e: z.infer<typeof submitCommentSchema>) => {


        replyMutate({ content: e.content, postId, parentCommentId: comment.id });

        setShowReplyInput(false)
        resetReply();
    }

    
    return (
        <div className="mt-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
            <div className="flex items-start space-x-2">
                {
                    comment.commentOwner &&
                    <UserAvatar name={comment.commentOwner.name || "Unknown"} image={comment.commentOwner.image} size={5} />

                }
                <div className="flex flex-col gap-1">
                    <div className="flex-grow flex items-center">

                        <p className="text-sm font-semibold">u/{comment.commentOwner?.name || "Unknown"}</p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">• {timeAgo(comment.createdAt)}</span>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300">{comment.content}</p>
                    <div className="flex items-center space-x-2 mt-1">
                        <Votes id={comment.id} votes={comment.votes || []} voteFor='Comment'>
                            {depth < 2 && <Button variant="ghost" size="sm" className="text-xs p-0 h-auto" onClick={() => setShowReplyInput(!showReplyInput)}>Reply</Button>}
                        </Votes>
                    </div>
                    {showReplyInput && (
                        <form onSubmit={handleReply(onReply)} className="mt-2">
                            <Input {...replyRegister('content')} placeholder="Write a reply..." className="text-sm rounded-full" />
                            {replyError.content && <p className="text-xs text-red-600 self-start">{replyError.content.message}</p>}
                            <Button disabled={isPending} type="submit" size="sm" className="rounded-full mt-2 bg-gray-200 dark text-black">{isPending ? "Replying..." : "Reply"}</Button>
                        </form>
                    )}
                </div>
            </div>

            {comment.children && comment.children.map(reply => (
                
                depth < 3 && <CommentComponent postId={postId} key={reply.id} comment={reply as CommentProps} depth={depth + 1} />
            ))}
        </div>
    );
};

export default CommentBox