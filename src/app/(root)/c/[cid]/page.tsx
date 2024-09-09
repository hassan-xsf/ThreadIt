"use client"
import React, { useEffect, useState } from 'react'
import { Plus, MoreHorizontal, Router } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getCommunity, joinCommunity } from '@/services/community'
import { Button } from '@/components/ui/Button'
import CommunityLoading from './loading'
import { useSession } from 'next-auth/react'
import UserAvatar from '@/components/ui/UserAvatar'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import NotFound from '@/components/ui/NotFound'
import timeAgo from '@/lib/timeAgo'
import { Post } from './post/[postId]/page'


const page = ({ params }: { params: { cid: string } }) => {

    const { data: session } = useSession()
    const { cid } = params;
    const [isJoined, setisJoined] = useState(false)
    const [commMembers, setcomMembers] = useState(0)

    const router = useRouter()
    const { isError, isLoading, isSuccess, data } = useQuery({
        queryKey: ['community', cid],
        queryFn: () => getCommunity(cid),
        retry: false,
        enabled: !!cid
    })

    useEffect(() => {
        if (data) {
            console.log(data.data.data.posts)
            setcomMembers(data.data.data.c._count.members)
            setisJoined(data.data.data.isjoined)
        }
    }, [data])

    const { mutate: mutateJoinCommunity, isPending: joinPending } = useMutation({
        mutationFn: () => joinCommunity(cid),
        onSuccess: (res) => {

            toast.info(res.data.message)
            setcomMembers(prev => prev + (res.data.data.isJoined ? 1 : -1))
            setisJoined(prev => !prev)
        },
    })
    const handleJoin = () => {
        if (session?.user) {
            mutateJoinCommunity();
        }
        else {
            router.push("/sign-in")
        }
    }
    return <>
        {isError && <NotFound name={"Community"} />}
        {isLoading && <CommunityLoading />}
        {
            isSuccess &&
            <div className="min-h-screen bg-gray-100 dark:bg-primary-black text-gray-900 dark:text-gray-100">
                <div className="max-w-screen-xl mx-auto">
                    {/* Banner */}
                    <div className="h-32 bg-primary-black dark:bg-white relative">
                        {
                            data.data.data.c.banner ?
                                <Image
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                    width="900"
                                    height="128"
                                    src={data.data.data.c.banner}
                                    alt="Banner"
                                    className="object-cover object-center"
                                />
                                :
                                <div className="w-full h-full object-fill">
                                </div>
                        }
                        <div className="absolute -bottom-8 left-4 flex items-end">
                            {
                                data.data.data.c.profile ?
                                    <Image className="bg-red-500 rounded-full flex items-center justify-center text-white text-4xl border-4 border-white" src={data.data.data.c.profile} width="96" height="96" alt="Profile" />
                                    :
                                    <div className="bg-red-500 rounded-full flex size-24 items-center justify-center text-white text-4xl border-4 border-white">
                                        {data.data.data.c.name[0]}
                                    </div>
                            }
                            <h1 className="text-3xl font-bold ml-2">r/{data.data.data.c.name}</h1>
                        </div>
                    </div>

                    {/* Header */}
                    <header className="bg-white dark:bg-primary-black shadow-sm p-4 flex items-center justify-end pt-8">
                        <div className="flex items-center space-x-2">
                            <Link href={`/c/${data.data.data.c.id}/submit`}>
                                <Button variant="outline" className="rounded-full flex items-center">
                                    <Plus className="w-4 h-4 mr-1" />
                                    Create Post
                                </Button>
                            </Link>
                            <Button disabled={joinPending} onClick={handleJoin} className="rounded-full">{joinPending ? (!isJoined ? "Joining..." : "Leaving...") : (!isJoined ? "Join" : "Leave")}</Button>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-6 h-6" />
                            </Button>
                        </div>
                    </header>

                    <div className="flex mt-4">
                        {/* Main content area */}
                        <main className="flex-grow pr-4">
                            <div className="bg-white dark:bg-primary-black p-4 rounded-md shadow-sm">
                                {
                                    //yeah yeah should'n't have
                                    /// TODO
                                    data.data.data.posts && data.data.data.posts.map((post : any) => (
                                        <Post
                                            comId = {cid}
                                            key={post.id}
                                            id={post.id}
                                            author={post.User}
                                            title={post.heading}
                                            content={post.content}
                                            image={post.postImage || undefined}
                                            votes={post.votes}
                                            commentCount={post.comments.length || 0}
                                            timeAgo={timeAgo(post.createdAt)}
                                            comments={post.comments}
                                            commentsDisabled={true}
                                        >
                                            <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl shadow-sm mb-4">
                                                <h2 className="text-lg font-semibold mb-2">{data.data.data.c.name}</h2>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                                    {data.data.data.c.description || "No description found!"}
                                                </p>
                                                <div className="flex justify-between text-sm">
                                                    <div>
                                                        <p className="font-bold">{commMembers}</p>
                                                        <p className="text-gray-600 dark:text-gray-400">Members</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                session?.user &&
                                                <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl shadow-sm mb-4">
                                                    <h3 className="text-lg font-semibold mb-2">USER</h3>
                                                    <div className="flex items-center space-x-2">
                                                        <UserAvatar image={session.user.image} name={session.user.name} />
                                                        <div>
                                                            <p className="font-medium">{session.user.name}</p>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">Hello there :)</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </Post>
                                    ))
                                }
                            </div>
                        </main>

                        {/* Sidebar */}
                        <aside className={`${data.data.data.posts ? "hidden" : "block"} w-80`}>
                            <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl shadow-sm mb-4">
                                <h2 className="text-lg font-semibold mb-2">{data.data.data.c.name}</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    {data.data.data.c.description || "No description found!"}
                                </p>
                                <div className="flex justify-between text-sm">
                                    <div>
                                        <p className="font-bold">{commMembers}</p>
                                        <p className="text-gray-600 dark:text-gray-400">Members</p>
                                    </div>
                                </div>
                            </div>
                            {
                                session?.user &&
                                <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl shadow-sm">
                                    <h3 className="text-lg font-semibold mb-2">USER</h3>
                                    <div className="flex items-center space-x-2">
                                        <UserAvatar image={session.user.image} name={session.user.name} />
                                        <div>
                                            <p className="font-medium">{session.user.name}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Hello there :)</p>
                                        </div>
                                    </div>
                                </div>
                            }
                        </aside>
                    </div>
                </div>
            </div>
        }
    </>
}

export default page