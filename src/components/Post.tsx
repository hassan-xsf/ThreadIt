import React from 'react'
import { MessageSquare, MoreHorizontal, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import RightSideRules from "@/components/RightSideRules"
import ShareButton from "@/components/ShareButton"
import UserAvatar from "@/components/UserAvatar"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Votes from "@/components/Votes"
import { Vote } from '@prisma/client'
import CommentBox from './CommentBox'

import CommunityAvatar from './CommunityAvatar'
import { CommentProps } from '@/types/CommentProps'
import Image from 'next/image'





export type PostProps = {
    comId?: string
    id: string,
    author: {
        name: string | null,
        image: string | null,
    }
    title: string;
    content: string;
    image?: string;
    votes: Vote[];
    commentCount: number;
    timeAgo: string;
    comments: CommentProps[]
    commentsDisabled?: boolean;
    comName?: string,
    comProfile?: string
}

export function Post({ comId, id, author, title, content, image, votes, commentCount, timeAgo, comments, commentsDisabled = false, comName, comProfile }: PostProps) {
    return (
        <div className="w-[50vw] 2xl:w-[40vw] min-w-96 mx-auto justify-center flex flex-row my-8 gap-4">
            <Card className={cn("bg-white dark:bg-primary-black text-gray-900 dark:text-gray-100 h-fit", commentsDisabled ? "cursor-pointer hover:dark:bg-zinc-800 hover:bg-gray-100 min-w-full" : "cursor-default w-[80%]")} >
                <Link href={`/c/${comId}/post/${id}`}>
                    {
                        comName &&
                        <div className="flex items-start space-x-2 px-2 rounded-full w-fit">
                            <CommunityAvatar id={comId!} name={comName} profile={comProfile || ""} />
                        </div>
                    }
                    <CardHeader className="flex items-start space-x-4">
                        <div className="flex-grow">
                            <div className="flex items-center space-x-2">
                                <UserAvatar name={author.name} image={author.image} />
                                <span className="text-sm font-semibold">u/{author.name}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">• {timeAgo}</span>
                            </div>
                            <h2 className="text-xl font-bold mt-2">{title}</h2>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {image && <Image height = "900" width = "900" src={image} alt={title} className="w-full rounded-md mb-4 max-h-full" />}
                        <p className="text-sm break-all">{content}</p>
                    </CardContent>
                </Link>
                <Votes id={id} votes={votes} voteFor={'Post'}>
                    <Link href={`/c/${comId}/post/${id}`} className={cn(buttonVariants({ variant: 'ghost' }), "text-xs p-1 h-6")}>
                        <MessageSquare className="size-6 mr-1" />
                        <span className="text-sm font-bold">{commentCount}</span>
                    </Link>
                    <ShareButton link = {`/c/${comId}/post/${id}`}>
                        <Button variant="ghost" size="sm" className="text-sm p-1 h-6">
                            <Share2 className="size-5 mr-2" />
                            Share
                        </Button>
                    </ShareButton>
                    <Button variant="ghost" size="sm" className="text-xs p-1 h-6">
                        <MoreHorizontal className="size-5" />
                    </Button>
                </Votes>
                {!commentsDisabled && <CommentBox postId={id} initialComments={comments} />}
            </Card>
            {!commentsDisabled &&
                <div className="hidden lg:block w-[40%]">
                    <RightSideRules enableShowOff={true} />
                </div>
            }
        </div >
    )
}

export default Post