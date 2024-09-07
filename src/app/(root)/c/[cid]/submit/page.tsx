
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import UserAvatar from "@/components/ui/UserAvatar"
import CreatePost from "@/components/ui/CreatePost"
import { db } from "@/lib/db"
import CommunityNotFound from "../error"

export default async function page({ params }: { params: { cid: string } }) {
    const session = await getServerSession(authOptions)
    const { cid } = params;

    const coms = await db.community.findUnique({
        where: {
            id: cid,
        },
    });
    return <>
        {!coms ? <CommunityNotFound />
            :
            session &&
            <div className="flex justify-center p-4 bg-white dark:bg-primary-black">
                <div className="w-full max-w-4xl space-y-6">
                    <h1 className="text-2xl font-bold dark:text-white">Create post as</h1>
                    <div className="flex items-center space-x-2">
                        <UserAvatar image={session.user.image} name={session?.user.name} />
                        <span className="text-lg font-medium dark:text-white">{session.user.name}</span>
                    </div>
                    <CreatePost session={session} cid={cid} />
                </div>
                <div className="hidden lg:block lg:w-1/3 lg:pl-8">
                    <Card className="mb-4 bg-gray-100 dark:bg-zinc-950">
                        <CardHeader>
                            <CardTitle className="text-lg">R/WEBDEV RULES</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-decimal pl-4 text-sm">
                                <li>No vague support questions about WYSIWYG editors or other software.</li>
                                <li>No memes, screenshots, and jokes.</li>
                                <li>No self-promotion.</li>
                                <li>No commercial promotions/solicitations.</li>
                                <li>No soliciting feedback not on Saturday.</li>
                                <li>Assistance Questions Guidelines.</li>
                                <li>Career/Getting Started Questions.</li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="mb-4 bg-gray-100 dark:bg-zinc-950">
                        <CardHeader>
                            <CardTitle className="text-lg">USER FLAIR</CardTitle>
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