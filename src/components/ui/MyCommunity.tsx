import { db } from '@/lib/db'
import { Community } from '@prisma/client'
import { Session } from 'next-auth'
import Image from 'next/image'
import React from 'react'


const MyCommunity = async ({ session }: { session: Session }) => {

    const coms = await db.user.findUnique({
        where: {
            id: session.user.id,
        },
        select: {
            joinedCommunities: {
                take: 5,
            }
        },
    });
    // console.log(coms.joinedCommunities)


    return (
        coms &&
        <>
            {
                coms?.joinedCommunities.map((c: Community, index: number) => (
                    <li key={index} className="flex items-center space-x-2">
                        {
                            c.profile ?
                                <Image src={c.profile} width="50" height="50" alt="Profile" className="size-7 rounded-full" />
                                :
                                <div className="size-7 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                                    {c.name[0]}
                                </div>
                        }
                        <span>r/{c.name}</span>
                    </li>
                ))
            }
        </>
    )
}

export default MyCommunity