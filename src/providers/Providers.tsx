"use client"

import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { QueryClientProvider } from '@tanstack/react-query'
import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient();
const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <ThemeProvider attribute="class" defaultTheme="light">
                    {children}
                </ThemeProvider>
            </SessionProvider>
        </QueryClientProvider>
    )
}

export default Providers