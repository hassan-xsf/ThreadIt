import Post from "@/components/ui/Post";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import timeAgo from "@/lib/timeAgo";
import { getServerSession } from "next-auth";

export default async function page({ searchParams }: { searchParams: { feed: string } }) {

  const session = getServerSession(authOptions)
  console.log(searchParams)

  const posts = await db.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
    include: {
      community: true,
      User: {
        select: {
          name: true,
          image: true,
        }
      },
      votes: true,
      _count: {
        select:
        {
          comments: true
        },
      },
    }
  })
  return (
    <div className="min-h-screen pl-44 mx-auto bg-white dark:bg-primary-black text-gray-900 dark:text-gray-100">
      <div className="w-[calc(100vw-50vw)] mx-auto">
        {!posts?.length ? (
          posts.map((post) => (
            <Post
              key={post.id}
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
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>
    </div>
  )
}