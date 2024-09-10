"use client"
// yoinked from ShadCN Docs

import { Copy } from "lucide-react"

import { Button } from "@/components/ui/Button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useEffect, useRef, useState } from "react"

const ShareButton = ({link , children} : {link: string ,children : React.ReactElement}) => {

    const [copyLink , setcopyLink] = useState("")
    const inputRef = useRef<HTMLInputElement | null>(null);


    useEffect(() => {
        setcopyLink(window.location.host + link)
    } , [])

    const handleCopy = () => {
        navigator.clipboard.writeText(copyLink)
        toast.info("Link has been copied to your clipboard!")
        if(inputRef.current) {
            inputRef.current.select();
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white dark:bg-black">
                <DialogHeader>
                    <DialogTitle className = "text-blue-500">Share link</DialogTitle>
                    <DialogDescription>
                        Click on the 'copy' icon to copy the link
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Input
                            ref = {inputRef}
                            id="link"
                            defaultValue={copyLink}
                            readOnly
                        />
                    </div>
                    <Button onClick = {handleCopy} variant = "outline" size="sm" className="px-3">
                        <Copy className="size-4" />
                    </Button>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ShareButton