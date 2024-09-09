import { authOptions } from '@/lib/auth'
import { Home, TrendingUp, Compass, List, Plus, Info, HelpCircle } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import MyCommunity from './MyCommunity'

const Sidebar = async () => {

    const data = await getServerSession(authOptions)

    return (
        <aside className="w-64 bg-white min-h-screen dark:bg-black border-r border-gray-200 dark:border-gray-700 pt-16 overflow-y-auto fixed top-0">
            <div className="p-4">
                <ul className="space-y-1">
                    {[
                        { icon: Home, label: 'Home' },
                        { icon: TrendingUp, label: 'Popular' },
                        { icon: Compass, label: 'Explore' },
                        { icon: List, label: 'All' },
                    ].map((item, index) => (
                        <Link  href="/" key={index} className="flex items-center gap-4 font-light text-sm py-1">
                            <div className="p-1 rounded-full">
                                <item.icon size={20} className="dark:text-white text-black" />
                            </div>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </ul>
            </div>
            {
                data?.user &&
                <>
                    {/* <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                        <h3 className="text-xs pb-2 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">RECENT</h3>
                        <ul className="space-y-3">
                            {['AskThreadIt', 'ThreadItTech'].map((community, index) => (
                                <li key={index} className="flex items-center space-x-2">
                                    <div className="size-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                                        {community[0]}
                                    </div>
                                    <span>r/{community}</span>
                                </li>
                            ))}
                        </ul>
                    </div> */}

                    <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                        <h3 className="text-xs pb-2 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">COMMUNITIES</h3>
                        <ul className="space-y-3">
                            <MyCommunity session = {data}/>
                            <li className="flex pt-2 items-center space-x-2 text-black dark:text-white cursor-pointer">
                                <Plus size={24} />
                                <Link href="/c/create">Create a community</Link>
                            </li>
                        </ul>
                    </div>
                </>
            }

            <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">RESOURCES</h3>
                <ul className="space-y-1">
                    {[
                        { icon: Info, label: 'About' },
                        { icon: HelpCircle, label: 'Help' },
                    ].map((item, index) => (
                        <li key={index} className="flex items-center gap-2.5 font-light text-sm py-1">
                            <div className="p-1 rounded-full">
                                <item.icon size={28} className="dark:text-white text-black" />
                            </div>
                            <span>{item.label}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    )
}

export default Sidebar