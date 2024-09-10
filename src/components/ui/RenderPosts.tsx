import React, { Suspense } from 'react'
import { PostSkeleton } from './PostSkeleton'
import Post from './Post'
import timeAgo from '@/lib/timeAgo'
import NoPostsAvailable from './NoPostAvailable'



///TODO
/// ADD better types
const RenderPosts = ({ posts }: { posts: any }) => {
    return (
        posts.length ? (
            posts.map((post: any, indx: number) => (
                <Post
                    key={post.id + indx}
                    comName={post.community.name}
                    comProfile={post.community.profile || ""}
                    comId={post.community.id}
                    id={post.id}
                    title={post.heading}
                    author={post.User}
                    content={post.content}
                    image={post.postImage || undefined}
                    votes={post.votes}
                    commentCount={post._count.comments}
                    commentsDisabled={true}
                    comments={[]}
                    timeAgo={timeAgo(post.createdAt)}
                />
            )))
            :
            <NoPostsAvailable />

    )
}

export default RenderPosts