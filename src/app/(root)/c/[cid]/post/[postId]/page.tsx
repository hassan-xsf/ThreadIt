
import NotFound from "@/components/ui/NotFound"

import { db } from "@/lib/db"
import timeAgo from "@/lib/timeAgo"
import Post from "@/components/ui/Post"



export default async function page({ params }: { params: { postId: string, cid: string } }) {

    const { postId, cid } = params;

    // As far as I am aware Prisma doesn't support recursive queries like this, Or am I missing something?
    /// This thing manually-x find's the replies until third level.

    if (!postId) return <NotFound name="Post" />

    const postDetails = await db.post.findUnique({
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
    })
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
