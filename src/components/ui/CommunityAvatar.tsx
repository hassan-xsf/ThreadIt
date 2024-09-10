"use client"

import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React from 'react'


const CommunityAvatar = ({ id, name, profile }: { id: string, name: string, profile: string }) => {

    const router = useRouter();

    const navgiateToCommunity = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/c/${id}`);
    }
    return (
        <button onClick={navgiateToCommunity} key={id} className="flex items-center space-x-2">
            {
                profile ?
                    <Image src={profile} width="50" height="50" alt="Profile" className="size-7 rounded-full" />
                    :
                    <div className="size-7 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                        {name[0]}
                    </div>
            }
            <span className="text-sm font-semibold">c/{name}</span>
        </button>
    )
}

export default CommunityAvatar