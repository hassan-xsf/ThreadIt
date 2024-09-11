import { getAuthSession } from '@/lib/auth'
import {Plus, Info, HelpCircle } from 'lucide-react'

import Link from 'next/link'
import MyCommunity from './MyCommunity'
import Navigations from './Navigations'

const Sidebar = async () => {

    const data = await getAuthSession();

    return (
        <aside className="w-14 sm:w-64 bg-white dark:bg-black flex flex-col items-center sm:items-start min-h-screen border-r border-gray-200 dark:border-gray-800 fixed top-[3.5rem] left-0 z-50">
            <div className="p-4">
                <Navigations/>
            </div>
            {
                data?.user &&
                <div className="border-t w-full border-gray-200 dark:border-gray-800 p-4">
                    <h3 className="text-[5px] sm:text-xs pb-2 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">COMMUNITIES</h3>
                    <ul className="space-y-3">
                        <MyCommunity session={data} />
                        <Link href="/c/create" className="flex pt-2 items-center space-x-2 text-black dark:text-white cursor-pointer">
                            <Plus size={24} />
                            <span className = "hidden sm:block">Create a community</span>
                        </Link>
                    </ul>
                </div>
            }

            <div className="border-t w-full border-gray-200 dark:border-gray-800 p-4">
                <h3 className="text-[5px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">RESOURCES</h3>
                <ul className="space-y-1">
                    {[
                        { icon: Info, label: 'About' },
                        { icon: HelpCircle, label: 'Help' },
                    ].map((item, index) => (
                        <li key={index} className="flex items-center gap-2.5 font-light text-sm py-1">
                            <div className="p-1 rounded-full">
                                <item.icon size={28} className="dark:text-white text-black" />
                            </div>
                            <span className = "hidden sm:block">{item.label}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    )
}

export default Sidebar