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
import { Vote, VoteType } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'


const CommentFooter = ({ postId, votes, commentCount }: { postId: string, votes: Vote[], commentCount: number }) => {

    const {data: session} = useSession();
    const router = useRouter();
    const [currentVotes, setCurrentVotes] = useState(0)
    const [isVoted , setisVoted] = useState<null | TypeEnum>(null)


    useEffect(() => {

        let totalVotes : number = 0;

        votes.forEach(i => {
            if(i.type === 'Downvote') totalVotes--;
            else if(i.type === 'Upvote') totalVotes++;
        })
        setCurrentVotes(totalVotes)
        if(session?.user) {
            votes.some(e => {
                e.userId === session.user.id
                if(e.type === "Upvote") {
                    setisVoted(TypeEnum.Upvote)
                }
                else if(e.type === "Downvote") {
                    setisVoted(TypeEnum.Downvote)
                }
            })
        }

    }, [votes , session])


    const { mutate: mutateVote, isPending } = useMutation({
        mutationFn: vote,
        onSuccess: (res) => {

            if (res.data.data.vote === null) {
                setCurrentVotes(res.data.data.voteCount)
                setisVoted(null)
            }
            else {
                setisVoted(res.data.data.voteType === "Upvote" ? TypeEnum.Upvote : TypeEnum.Downvote)
                console.log(res.data.data)
                setCurrentVotes(res.data.data.voteCount)
            }
        },
        onError: (error) => {
            console.log(error)
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message)
            }
            else {
                toast.error("There was a problem, please try again later..")
            }
        }
    })
    const handleVote = (type: TypeEnum) => {
        if(!session?.user) {
            return router.push("/sign-in")
        }   
        if (!isPending) mutateVote({ type, postId })
    }
    return (
        <CardFooter className="flex justify-start items-center space-x-4">
            <div className="flex space-x-4 text-sm">
                {/* Upvote/Downvote */}
                <div className= {`flex items-center space-x-2 ${isVoted === null ? "bg-gray-100 dark:bg-neutral-950" : isVoted === VoteType.Upvote ? "bg-[#D93900]" : "bg-[#6A5CFF]"} text-white p-1 rounded-full`}>
                    <button disabled = {isPending} onClick={() => handleVote(TypeEnum.Upvote)} className="text-gray-400 hover:text-white focus:outline-none">
                        <ArrowBigUp size={28} className={`hover:scale-110 ${isVoted ? "fill-white text-white" : "fill-none dark:text-white text-gray-400"}`} />
                    </button>
                    {isPending ? <Loader2 className="animate-spin" /> : <span className="dark:text-white text-black font-bold">{currentVotes}</span>}
                    <button disabled = {isPending} onClick={() => handleVote(TypeEnum.Downvote)} className="text-gray-400 hover:text-white focus:outline-none">
                        <ArrowBigDown size={28}  className={`hover:scale-110 ${isVoted ? "fill-white text-white" : "fill-none dark:text-white text-gray-400"}`} />
                    </button>
                </div>
            </div>
        
            <Button variant="ghost" size="lg" className="text-xs p-1 h-6">
                <MessageSquare className="size-6 mr-1" />
                <span className="text-sm font-bold">{commentCount}</span>
            </Button>
            <ShareButton>
                <Button variant="ghost" size="sm" className="text-sm p-1 h-6">
                    <Share2 className="size-5 mr-2" />
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