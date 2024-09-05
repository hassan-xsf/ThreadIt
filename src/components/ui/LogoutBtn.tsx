"use client"

import React from 'react'
import { Button } from './Button'
import { signOut } from 'next-auth/react'

const LogoutBtn = () => {
    return (
        <Button onClick={() => signOut({
            redirect: true,
            callbackUrl: `${window.location.origin}/sign-in`
        })}>Sign Out</Button>
    )
}

export default LogoutBtn