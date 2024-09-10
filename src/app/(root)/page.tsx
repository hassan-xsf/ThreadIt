
import NoPostsAvailable from "@/components/ui/NoPostAvailable";
import Post from "@/components/ui/Post";
import { PostSkeleton } from "@/components/ui/PostSkeleton";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import timeAgo from "@/lib/timeAgo";
import { Suspense } from "react";

export default async function page({ searchParams }: { searchParams: { feed: string } }) {

  const session = await getAuthSession();
  const { feed } = searchParams;

  let orderBy: Record<any, any> = { createdAt: 'desc' };

  if (feed === 'popular') {
    orderBy =
    {
      votes:
      {
        _count: 'desc'
      }
    };
  }
  let where = {};

  if (session?.user && feed === 'home') {
    const coms = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        joinedCommunities: {
          select: {
            id: true,
          }
        }
      },
    });
    if (coms?.joinedCommunities?.length) {
      console.log(coms.joinedCommunities);
      const communityIds = coms.joinedCommunities.map(c => c.id); 
      where = {
        communityId: {
          in: communityIds, 
        },
      };
    }
    else {
      return <NoPostsAvailable/>
    }
  }

  const posts = await db.post.findMany({
    orderBy,
    where,
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
        <Suspense fallback={<PostSkeleton />}>
          {posts?.length ? (
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
            <>
              <NoPostsAvailable />
            </>
          )}
        </Suspense>

      </div>
    </div>
  );
}