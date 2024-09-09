
import { Button, buttonVariants } from "@/components/ui/Button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import CommentBox from "@/components/ui/CommentBox"
import Votes from "@/components/ui/Votes"
import NotFound from "@/components/ui/NotFound"
import RightSideRules from "@/components/ui/RightSideRules"
import ShareButton from "@/components/ui/ShareButton"
import UserAvatar from "@/components/ui/UserAvatar"
import { db } from "@/lib/db"
import timeAgo from "@/lib/timeAgo"
import { Comment, Vote } from "@prisma/client"
import { MessageSquare, MoreHorizontal, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"



export type PostProps = {
    comId?: string
    id: string,
    author: {
        name: string,
        image: string,
    }
    title: string;
    content: string;
    image?: string;
    votes: Vote[];
    commentCount: number;
    timeAgo: string;
    comments: CommentProps[];
    commentsDisabled?: boolean;
    children?: React.ReactNode
}

export type CommentProps = Comment & {
    commentOwner: {
        name: string,
        image: string,
    }
    votes: Vote[]
    parentComment?: Comment,
    children?: Comment[]
}


export default async function page({ params }: { params: { postId: string, cid: string } }) {

    const { postId, cid } = params;
    console.log(params)
    // TODO
    // Shouldn't have used this, but am lazy rn.

    let postDetails: Record<any, any> | null = null;

    // As far as I am aware Prisma doesn't support recursive queries like this, Or am I missing something?
    // TODO
    /// This thing manually-x find's the replies until third level.
    if (postId) {
        postDetails = await db.post.findUnique({
            where: {
                id: postId,
            },
            select: {
                id: true,
                heading: true,
                content: true,
                postImage: true,
                createdAt: true,
                User: {
                    select: {
                        name: true,
                        image: true,
                    }
                },
                votes: true,
                comments: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        commentId: true,
                        parentComment: true,
                        commentOwner: {
                            select: {
                                name: true,
                                image: true,
                            }
                        },
                        votes: true,

                        // First level of children
                        children: {
                            select: {
                                id: true,
                                content: true,
                                createdAt: true,
                                commentId: true,
                                parentComment: true,
                                commentOwner: {
                                    select: {
                                        name: true,
                                        image: true,
                                    }
                                },
                                votes: true,

                                // Second level of children (children of children)
                                children: {
                                    select: {
                                        id: true,
                                        content: true,
                                        createdAt: true,
                                        commentId: true,
                                        parentComment: true,
                                        commentOwner: {
                                            select: {
                                                name: true,
                                                image: true,
                                            }
                                        },
                                        votes: true,

                                        // Third level of children (children of children of children)
                                        children: {
                                            select: {
                                                id: true,
                                                content: true,
                                                createdAt: true,
                                                commentId: true,
                                                parentComment: true,
                                                commentOwner: {
                                                    select: {
                                                        name: true,
                                                        image: true,
                                                    }
                                                },
                                                votes: true,
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

    }
    return (
        !postDetails ? <NotFound name="Post" />
            :
            <Post
                comId={cid}
                id={postDetails.id}
                author={postDetails.User}
                title={postDetails.heading}
                content={postDetails.content}
                image={postDetails.postImage || undefined}
                votes={postDetails.votes}
                commentCount={postDetails.comments.length || 0}
                timeAgo={timeAgo(postDetails.createdAt)}
                comments={postDetails.comments}
            />
    )
}

export function Post({ comId, id, author, title, content, image, votes, commentCount, timeAgo, comments, commentsDisabled = false, children }: PostProps) {
    return (
        <div className="w-[calc(100vw-30vw)] min-w-96 mx-auto justify-center flex flex-row my-8 gap-4">
            <Card className={cn("h-full w-[90%] sm:w-[70%] lg:w-[40%] bg-white dark:bg-primary-black text-gray-900 dark:text-gray-100", commentsDisabled ? "cursor-pointer hover:dark:bg-zinc-800 hover:bg-gray-100" : "cursor-none")} >
                <Link href={`/c/${comId}/post/${id}`}>
                    <CardHeader className="flex items-start space-x-4">
                        <div className="flex-grow">
                            <div className="flex items-center space-x-2">
                                <UserAvatar name={author.name} image={author.image} />
                                <span className="text-sm font-semibold">{author.name}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">• {timeAgo}</span>
                            </div>
                            <h2 className="text-xl font-bold mt-2">{title}</h2>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {image && <img src={image} alt={title} className="w-full rounded-md mb-4" />}
                        <p className="text-sm break-all">{content}</p>
                    </CardContent>
                </Link>
                <Votes id={id} votes={votes} voteFor={'Post'}>
                    <Link href={`/c/${comId}/post/${id}`} className= {cn(buttonVariants({variant: 'ghost'}) , "text-xs p-1 h-6")}>
                        <MessageSquare className="size-6 mr-1" />
                        <span className="text-sm font-bold">{commentCount}</span>
                    </Link>
                    <ShareButton>
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
            {
                <div className="hidden lg:block w-[25%]">
                    {children}
                    <RightSideRules enableShowOff={true} />
                </div>
            }
        </div >
    )
}