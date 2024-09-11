"use client"

import React from 'react'
import { Home, TrendingUp, Compass, List } from 'lucide-react'

import { useRouter, useSearchParams } from 'next/navigation';


const Navigations = () => {

    const router = useRouter();
    const handleNavigation = (feed: string) => {
        router.push(`?feed=${feed}`);
        setTimeout(() => window.location.reload() , 200);
    };
    return (
        <ul className="space-y-1">
            {[
                { icon: Home, label: 'Home' },
                { icon: TrendingUp, label: 'Popular' },
                { icon: Compass, label: 'Explore' },
                { icon: List, label: 'All' },
            ].map((item, index) => (
                <button onClick={() => handleNavigation(item.label.toLowerCase())} key={index} className="flex items-center gap-4 font-light text-sm py-1">
                    <div className="p-1 rounded-full">
                        <item.icon size={20} className="dark:text-white text-black" />
                    </div>
                    <span className = "hidden sm:block">{item.label}</span>
                </button>
            ))}
        </ul>
    )
}

export default Navigations