"use client"
import React from 'react'
import { Plus, MoreHorizontal } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getCommunity } from '@/services/community'
import { Button } from '@/components/ui/Button'


const page = async ({ params }: { params: { cid: string } }) => {

    const { cid } = params;
    const { data } = useQuery({
        queryFn: () => getCommunity(cid),
        queryKey: ['community' , cid],
        enabled: !!cid
    })
    console.log(data)


    return (
        <div className="min-h-screen bg-gray-100 dark:bg-primary-black text-gray-900 dark:text-gray-100">
            <div className="max-w-screen-xl mx-auto">
                {/* Banner */}
                <div className="h-32 bg-red-500 relative">
                    <img
                        src="/placeholder.svg?height=128&width=1280"
                        alt="Web Development Banner"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute -bottom-8 left-4 flex items-end">
                        <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center text-white text-4xl border-4 border-white">
                            &lt;/&gt;
                        </div>
                        <h1 className="text-3xl font-bold ml-2">r/webdev</h1>
                    </div>
                </div>

                {/* Header */}
                <header className="bg-white dark:bg-primary-black shadow-sm p-4 flex items-center justify-end pt-8">
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" className="rounded-full flex items-center">
                            <Plus className="w-4 h-4 mr-1" />
                            Create Post
                        </Button>
                        <Button className="rounded-full">Join</Button>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-6 h-6" />
                        </Button>
                    </div>
                </header>

                <div className="flex mt-4">
                    {/* Main content area */}
                    <main className="flex-grow pr-4">

                        <div className="bg-white dark:bg-primary-black p-4 rounded-md shadow-sm">
                            <p>Post content goes here...</p>
                        </div>
                    </main>

                    {/* Sidebar */}
                    <aside className="w-80">
                        <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl shadow-sm mb-4">
                            <h2 className="text-lg font-semibold mb-2">webdev: reddit for web developers</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                A community dedicated to all things web development: both front-end and back-end. For more design-related questions, try /r/web_design.
                            </p>
                            <div className="flex justify-between text-sm">
                                <div>
                                    <p className="font-bold">2.5M</p>
                                    <p className="text-gray-600 dark:text-gray-400">Members</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl shadow-sm">
                            <h3 className="text-lg font-semibold mb-2">USER</h3>
                            <div className="flex items-center space-x-2">
                                <img
                                    src="/placeholder.svg?height=40&width=40"
                                    alt="User Avatar"
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <p className="font-medium">ALI</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Hello there :)</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}

export default page