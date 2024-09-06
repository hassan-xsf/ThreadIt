"use client"
import { Github } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { Button } from './Button'
import React from 'react'

function GithubSignIn() {
    return (
        <>
            <Button onClick={() => signIn("github", { callbackUrl: "/" })} variant="outline" className="w-full mb-4 rounded-xl flex items-center justify-center">
                <Github className="mr-2" size={20} />
                Continue with GitHub
            </Button>

        </>
    )
}

export default GithubSignIn