
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import NotFound from "@/components/ui/NotFound"
import RightSideRules from "@/components/ui/RightSideRules"
import ShareButton from "@/components/ui/ShareButton"
import UserAvatar from "@/components/ui/UserAvatar"
import { db } from "@/lib/db"
import timeAgo from "@/lib/timeAgo"
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, MoreHorizontal } from 'lucide-react'



export default async function page({ params }: { params: { postId: string } }) {

    const { postId } = params;
    // TODO
    // Shouldn't have used this, but am lazy rn.

    let postDetails: Record<any, any> | null = null;
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
                }
            }
        })
    }
    console.log(postDetails)

    return (
        !postDetails ? <NotFound name="Post" />
            :
            <Post
                author={postDetails.User}
                title={postDetails.heading}
                content={postDetails.content}
                image={postDetails.postImage || undefined}
                upvotes={238}
                commentCount={47}
                timeAgo={timeAgo(postDetails.createdAt)}
                comments={[]}
            // comments={[
            //     {
            //         id: 1,
            //         author: "user1",
            //         content: "This is the final form of boss for flexbox.",
            //         upvotes: 57,
            //         replies: [
            //             {
            //                 id: 2,
            //                 author: "user2",
            //                 content: "Agreed! It's a great learning tool.",
            //                 upvotes: 12,
            //                 replies: []
            //             }
            //         ]
            //     },
            //     {
            //         id: 3,
            //         author: "user3",
            //         content: "Thanks mate! I appreciate that. Any suggestions to improve?",
            //         upvotes: 23,
            //         replies: [
            //             {
            //                 id: 4,
            //                 author: "user4",
            //                 content: "Maybe add some advanced levels with CSS Grid?",
            //                 upvotes: 8,
            //                 replies: [
            //                     {
            //                         id: 5,
            //                         author: "user5",
            //                         content: "That's a great idea! Would love to see that implemented.",
            //                         upvotes: 5,
            //                         replies: []
            //                     }
            //                 ]
            //             }
            //         ]
            //     }
            // ]}
            />
    )
}


type Comment = {
    id: number;
    author: string;
    content: string;
    upvotes: number;
    replies: Comment[];
}

type PostProps = {
    author: {
        name: string,
        image: string,
    }
    title: string;
    content: string;
    image?: string;
    upvotes: number;
    commentCount: number;
    timeAgo: string;
    comments: Comment[];
}

// const CommentComponent = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
//     const [showReplyInput, setShowReplyInput] = useState(false);

//     if (depth >= 5) return null; // Limit depth to 5 levels

//     return (
//         <div className="mt-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
//             <div className="flex items-start space-x-2">
//                 <Avatar className="w-6 h-6">
//                     <AvatarFallback>{comment.author[0]}</AvatarFallback>
//                 </Avatar>
//                 <div className="flex-grow">
//                     <p className="text-sm font-semibold">{comment.author}</p>
//                     <p className="text-sm text-gray-600 dark:text-gray-300">{comment.content}</p>
//                     <div className="flex items-center space-x-2 mt-1">
//                         <Button variant="ghost" size="sm" className="text-xs p-0 h-auto"><ArrowBigUp className="w-4 h-4 mr-1" /> {comment.upvotes}</Button>
//                         <Button variant="ghost" size="sm" className="text-xs p-0 h-auto"><ArrowBigDown className="w-4 h-4" /></Button>
//                         <Button variant="ghost" size="sm" className="text-xs p-0 h-auto" onClick={() => setShowReplyInput(!showReplyInput)}>Reply</Button>
//                     </div>
//                     {showReplyInput && (
//                         <div className="mt-2">
//                             <Input placeholder="Write a reply..." className="text-sm" />
//                             <Button size="sm" className="mt-2">Submit</Button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//             {comment.replies.map(reply => (
//                 <CommentComponent key={reply.id} comment={reply} depth={depth + 1} />
//             ))}
//         </div>
//     );
// };

function Post({ author, title, content, image, upvotes, commentCount, timeAgo, comments }: PostProps) {
    return (
        <div className="max-w-screen-2xl flex flex-row items-start justify-center my-8 gap-4">
            <Card className="bg-white dark:bg-primary-black text-gray-900 dark:text-gray-100">
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
                    <p className="text-sm">{content}</p>
                </CardContent>
                <CardFooter className="flex justify-start items-center space-x-4">
                    <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" className="text-xs p-1 h-6"><ArrowBigUp className="size-6" /></Button>
                        <span className="text-sm font-bold">{upvotes}</span>
                        <Button variant="ghost" size="sm" className="text-xs p-1 h-6"><ArrowBigDown className="size-6" /></Button>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs p-1 h-6">
                        <MessageSquare className="size-5 mr-1" />
                        {commentCount}
                    </Button>
                    <ShareButton link="hello123">
                        <Button variant="ghost" size="sm" className="text-xs p-1 h-6">
                            <Share2 className="size-5 mr-1" />
                            Share
                        </Button>
                    </ShareButton>
                    <Button variant="ghost" size="sm" className="text-xs p-1 h-6">
                        <MoreHorizontal className="size-5" />
                    </Button>
                </CardFooter>

                <div className="px-4 pb-4">
                    <Input placeholder="Add a comment..." className="mb-4 rounded-xl" />
                    {/* {comments.map(comment => (
                    <CommentComponent key={comment.id} comment={comment} />
                ))} */}
                </div>
            </Card>
            <div className="hidden lg:block w-[30%]">
                <RightSideRules />
            </div>
        </div>
    )
}