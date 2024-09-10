
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
            <div className="min-h-screen pl-44 flex justify-center p-4 max-w-screen-xl mx-auto bg-white dark:bg-primary-black">
                <div className="space-y-6 w-full">
                    <h1 className="text-2xl font-bold dark:text-white">Create post as</h1>
                    <div className="flex items-center space-x-2">
                        <UserAvatar image={session.user.image} name={session?.user.name} />
                        <span className="text-lg font-medium dark:text-white">{session.user.name}</span>
                    </div>
                    <CreatePost cid={cid} />
                </div>
                <div className="hidden lg:block lg:w-2/3 lg:pl-8">
                    <RightSideRules/>
                    <Card className="mb-4 bg-gray-100 dark:bg-primary-black">
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