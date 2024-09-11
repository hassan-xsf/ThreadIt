"use client"

import React from 'react'
import { signOut } from 'next-auth/react'

const LogoutBtn = ({children} : {children: React.ReactNode}) => {
    return (
        <button className = "flex gap-2" onClick={() => signOut({
            redirect: true,
            callbackUrl: `${window.location.origin}/sign-in`
        })}>{children}</button>
    )
}

export default LogoutBtn