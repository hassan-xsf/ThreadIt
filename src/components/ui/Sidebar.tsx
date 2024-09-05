import { Home, TrendingUp, Compass, List, Plus, Info, HelpCircle } from 'lucide-react'

const Sidebar = () => {
    return (
        <aside className="w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-700 pt-16 overflow-y-auto">
            <div className="p-4">
                <ul className="space-y-2">
                    {[
                        { icon: Home, label: 'Home' },
                        { icon: TrendingUp, label: 'Popular' },
                        { icon: Compass, label: 'Explore' },
                        { icon: List, label: 'All' },
                    ].map((item, index) => (
                        <li key={index} className="flex items-center gap-4 font-light text-sm py-1">
                            <div className="p-1 rounded-full ring-1 ring-gray-400">
                                <item.icon size={20} className = "text-gray-400" />
                            </div>
                            <span>{item.label}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">RECENT</h3>
                <ul className="space-y-2">
                    {['AskThreadIt', 'ThreadItTech'].map((community, index) => (
                        <li key={index} className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                                {community[0]}
                            </div>
                            <span>r/{community}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">COMMUNITIES</h3>
                <ul className="space-y-2">
                    {['ThreadItNews', 'ThreadItGaming'].map((community, index) => (
                        <li key={index} className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                                {community[8]}
                            </div>
                            <span>r/{community}</span>
                        </li>
                    ))}
                    <li className="flex items-center space-x-2 text-blue-500 cursor-pointer">
                        <Plus size={16} />
                        <span>Create a community</span>
                    </li>
                </ul>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">RESOURCES</h3>
                <ul className="space-y-2">
                    {[
                        { icon: Info, label: 'About' },
                        { icon: HelpCircle, label: 'Help' },
                    ].map((item, index) => (
                        <li key={index} className="flex items-center space-x-2">
                            <div className="p-1 rounded-full bg-gray-200 dark:bg-gray-800">
                                <item.icon size={20} />
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