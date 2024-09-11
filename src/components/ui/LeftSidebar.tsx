
import React from 'react'
import UserAvatar from './UserAvatar'
import { Session } from 'next-auth'
import RightSideRules from './RightSideRules'

const LeftSidebar = ({ name, description, members , session }: { name: string, description: string, members: number , session: Session | null}) => {
    return (
        <div className = "hidden flex-col mx-4 w-full relative sm:flex">
            <div className="sticky inset-0 top-20">
                <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl shadow-sm mb-4">
                    <h2 className="text-lg font-semibold mb-2">{name}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {description || "No description found!"}
                    </p>
                    <div className="flex justify-between text-sm">
                        <div>
                            <p className="font-bold">{members}</p>
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
                <RightSideRules enableShowOff={false} />
            </div>
        </div>
    )
}

export default LeftSidebar