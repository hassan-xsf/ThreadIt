
import { getAuthSession } from "@/lib/auth"
import UserAvatar from "@/components/ui/UserAvatar"
import CreatePost from "@/components/ui/CreatePost"
import { db } from "@/lib/db"
import NotFound from "@/components/ui/NotFound"
import LeftSidebar from "@/components/ui/LeftSidebar"

export default async function page({ params }: { params: { cid: string } }) {
    const session = await getAuthSession();
    const { cid } = params;

    const coms = await db.community.findFirst({
        where: {
            id: cid
        },
        select: {
            id: true,
            name: true,
            banner: true,
            profile: true,
            description: true,
            createdAt: true,
            _count: {
                select: { members: true },
            },
        },
    })

    return <>
        {!coms ? <NotFound name="Community" />
            :
            session &&
            <div className="min-h-screen pl-10 sm:pl-64 xl:pl-44 flex justify-center p-4 max-w-screen-xl mx-auto bg-white dark:bg-primary-black">
                <div className="space-y-6 w-full">
                    <h1 className="text-2xl font-bold dark:text-white">Create post as</h1>
                    <div className="flex items-center space-x-2">
                        <UserAvatar image={session.user.image} name={session?.user.name} />
                        <span className="text-lg font-medium dark:text-white">{session.user.name}</span>
                    </div>
                    <CreatePost cid={cid} />
                </div>
                <div className="hidden w-1/2">
                    <LeftSidebar name={coms.name} description={coms.description || ""} members={coms._count.members} session={session} />
                </div>
            </div >
        }
    </>
}