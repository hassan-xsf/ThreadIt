"use client"

import React, { useEffect, useState } from 'react'
import ShareButton from "@/components/ui/ShareButton"
import { CardFooter, } from "@/components/ui/card"
import { Button } from "@/components/ui/Button"
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, MoreHorizontal, Loader2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { vote } from '@/services/vote'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { TypeEnum } from '@/schemas/voteSchema'


const CommentFooter = ({ postId, votes, commentCount }: { postId: string, votes: number, commentCount: number }) => {


    const [currentVotes , setCurrentVotes] = useState(0)

    useEffect(() => {
        setCurrentVotes(votes)
    }, [votes])


    const { mutate: mutateVote, isPending } = useMutation({
        mutationFn: vote,
        onSuccess: (res) => {
            if(res.data.data.vote === null) {
                setCurrentVotes(prev => prev + (res.data.data.voteType === 'Upvote' ? -1 : +1))
                console.log(currentVotes + (res.data.data.voteType === 'Upvote' ? -1 : +1))
            }
            else {
                setCurrentVotes(prev => prev + (res.data.data.voteType === 'Upvote' ? +1 : -1))
                console.log(currentVotes + (res.data.data.voteType === 'Upvote' ? +1 : -1))
            }
            console.log(res.data)
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message)
            }
            else {
                toast.error("There was a problem, please try again later..")
            }
        }
    })

    const handleVote = (type: TypeEnum) => {
        if(!isPending) mutateVote({ type , postId })
    }
    return (
        <CardFooter className="flex justify-start items-center space-x-4">
            <div className="flex items-center space-x-1">
                <Button onClick={() => handleVote(TypeEnum.Upvote)} variant="ghost" size="lg" className="text-xs p-1 h-7"><ArrowBigUp className="size-7" /></Button>
                {isPending ? <Loader2 className = "animate-spin"/> : <span className="text-sm font-bold">{currentVotes}</span>}
                <Button onClick={() => handleVote(TypeEnum.Downvote)} variant="ghost" size="lg" className="text-xs p-1 h-7"><ArrowBigDown className="size-7" /></Button>
            </div>
            <Button variant="ghost" size="lg" className="text-xs p-1 h-6">
                <MessageSquare className="size-6 mr-1" />
                <span className="text-sm font-bold">{commentCount}</span>
            </Button>
            <ShareButton>
                <Button variant="ghost" size="sm" className="text-xs p-1 h-6">
                    <Share2 className="size-5 mr-1" />
                    Share
                </Button>
            </ShareButton>
            <Button variant="ghost" size="sm" className="text-xs p-1 h-6">
                <MoreHorizontal className="size-5" />
            </Button>
        </CardFooter>
    )
}

export default CommentFooter