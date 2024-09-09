"use client"

import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from './avatar';
import { Button } from './Button';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { Comment } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { comment } from '@/services/comment';
import { toast } from 'sonner';
import { AxiosError } from 'axios';


type CommentWithReply = {
    id: number;
    author: string;
    content: string;
    upvotes: number;
    replies: Comment[];
}

const CommentBox = ({postId, comments, }: { postId: string, comments: Comment[] }) => {

    console.log(comments)
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [commentMessage , setCommentMessage] = useState("")
    const commentsTMP =
        [
            {
                id: 1,
                author: "user1",
                content: "This is the final form of boss for flexbox.",
                upvotes: 57,
                replies: [
                    {
                        id: 2,
                        author: "user2",
                        content: "Agreed! It's a great learning tool.",
                        upvotes: 12,
                        replies: []
                    }
                ]
            },
            {
                id: 3,
                author: "user3",
                content: "Thanks mate! I appreciate that. Any suggestions to improve?",
                upvotes: 23,
                replies: [
                    {
                        id: 4,
                        author: "user4",
                        content: "Maybe add some advanced levels with CSS Grid?",
                        upvotes: 8,
                        replies: [
                            {
                                id: 5,
                                author: "user5",
                                content: "That's a great idea! Would love to see that implemented.",
                                upvotes: 5,
                                replies: []
                            }
                        ]
                    }
                ]
            }
        ]


    const { mutate: commentMutate, isPending } = useMutation({
        mutationFn: comment,
        onSuccess: (res) => {
            console.log(res.data.data)
            toast.success("Commented successfully!")
        },
        onError: (error) => {
            if(error instanceof AxiosError) {
                toast.error(error.response?.data.message)
            }
            console.log(error)
        }
    })
    const onComment = () => {
        if(isPending) return;
        setCommentMessage("")
        commentMutate({content: commentMessage , postId})
    }

    return (
        <div className="px-4 pb-4">
            <div className="flex items-end flex-col">
                <Input disabled  = {isPending} minLength = {3} value = {commentMessage} maxLength = {201} placeholder="Add a comment..." onChange= {(e) => setCommentMessage(e.currentTarget.value)} onFocus={() => setShowReplyInput(true)} className="placeholder:text-gray-500 mb-4 rounded-xl" />
                {showReplyInput &&
                    <div className = "flex gap-2">
                        <Button disabled  = {isPending} onClick = {() => setShowReplyInput(false)} size="sm" className="rounded-full mt-2 bg-gray-200 dark text-black dark:text-white">Cancel</Button>
                        <Button disabled  = {isPending} onClick = {onComment} size="sm" className="rounded-full mt-2 bg-[#96401b] hover:bg-[#96401b] text-white ">{isPending ? "Commenting...." : "Comment"}</Button>
                    </div>
                }
            </div>

            {commentsTMP.map(comments => (

                <CommentComponent key={comments.id} comment={comments} />

            ))}
        </div>
    )
}



const CommentComponent = ({ comment, depth = 0 }: { comment: CommentWithReply; depth?: number }) => {
    const [showReplyInput, setShowReplyInput] = useState(false);

    if (depth >= 5) return null; // Limit depth to 5 levels

    return (
        <div className="mt-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
            <div className="flex items-start space-x-2">
                <Avatar className="w-6 h-6">
                    <AvatarFallback>{comment.author[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                    <p className="text-sm font-semibold">{comment.author}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{comment.content}</p>
                    <div className="flex items-center space-x-2 mt-1">
                        <Button variant="ghost" size="sm" className="text-xs p-0 h-auto"><ArrowBigUp className="w-4 h-4 mr-1" /> {comment.upvotes}</Button>
                        <Button variant="ghost" size="sm" className="text-xs p-0 h-auto"><ArrowBigDown className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" className="text-xs p-0 h-auto" onClick={() => setShowReplyInput(!showReplyInput)}>Reply</Button>
                    </div>
                    {showReplyInput && (
                        <div className="mt-2">
                            <Input placeholder="Write a reply..." className="text-sm" />
                            <Button size="sm" className="mt-2">Submit</Button>
                        </div>
                    )}
                </div>
            </div>
            {/* {comment.replies.map(reply => (
                <CommentComponent key={reply.id} comment={reply} depth={depth + 1} />
            ))} */}
        </div>
    );
};

export default CommentBox