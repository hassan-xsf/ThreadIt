"use client"

import { Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from './Button'

const ThemeBtn = () => {
    const { theme, setTheme } = useTheme()
    return (
        <>
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
        </>
    )
}

export default ThemeBtn