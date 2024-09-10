import { db } from '@/lib/db'
import { Community } from '@prisma/client'
import { Session } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import CommunityAvatar from './CommunityAvatar'


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


    return (
        coms &&
        <>
            {
                coms?.joinedCommunities.map((c: Community, index: number) => (
                    <CommunityAvatar key={index} id={c.id} name={c.name} profile={c.profile || ""} />
                ))
            }
        </>
    )
}

export default MyCommunity