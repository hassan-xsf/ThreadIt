
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import UserAvatar from "@/components/ui/UserAvatar"
import CreatePost from "@/components/ui/CreatePost"
import { db } from "@/lib/db"
import NotFound from "@/components/ui/NotFound"
import RightSideRules from "@/components/ui/RightSideRules"

export default async function page({ params }: { params: { cid: string } }) {
    const session = await getServerSession(authOptions)
    const { cid } = params;

    const coms = await db.community.findUnique({
        where: {
            id: cid,
        },
    });
    return <>
        {!coms ? <NotFound name="Community" />
            :
            session &&
            <div className="flex justify-center p-4 bg-white dark:bg-primary-black">
                <div className="w-full max-w-4xl space-y-6">
                    <h1 className="text-2xl font-bold dark:text-white">Create post as</h1>
                    <div className="flex items-center space-x-2">
                        <UserAvatar image={session.user.image} name={session?.user.name} />
                        <span className="text-lg font-medium dark:text-white">{session.user.name}</span>
                    </div>
                    <CreatePost cid={cid} />
                </div>
                <div className="hidden lg:block lg:w-1/3 lg:pl-8">
                    <RightSideRules/>
                    <Card className="mb-4 bg-gray-100 dark:bg-zinc-950">
                        <CardHeader>
                            <CardTitle className="text-lg">USER</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center space-x-2">
                            <UserAvatar image={session.user.image} name={session?.user.name} /><span className="text-md font-medium dark:text-white">{session.user.name}</span>
                        </CardContent>
                    </Card>
                </div>
            </div>
        }
    </>
}