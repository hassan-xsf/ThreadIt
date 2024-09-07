
import Image from 'next/image'
import React from 'react'

const UserAvatar = ({name , image , size = "7"} : {name: string | undefined | null, image: string | undefined | null , size? : string}) => {
    return (
        <div className={`cursor-pointer size-${size} rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold`}>
            {
                image ?
                    <>
                        <Image className="rounded-full size-full" width="50" height="50" src={image} alt="user" />
                    </>
                    :
                    <div>{name![0]}</div>
            }
        </div>
    )
}

export default UserAvatar