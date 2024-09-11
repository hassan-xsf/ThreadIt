"use client"
import React from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { createPost } from '@/services/community'
import { toast } from 'sonner'
import { postSchema } from '@/schemas/postSchema'
import { AxiosError } from 'axios'

const CreatePost = ({ cid }: { cid: string }) => {
    const router = useRouter();

    const { control, handleSubmit, setValue } = useForm<z.infer<typeof postSchema>>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            heading: '',
            content: '',
            postImage: ''
        }
    });
    const { mutate: postMutation, isPending } = useMutation({
        mutationFn: createPost,
        onError: (error) => {
            console.log(error)
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message)
            }
        },
        onSuccess: (res) => {
            router.push(`/c/${cid}/post/${res.data.data.id}`)
        }
    })
    const submitPost = (data: z.infer<typeof postSchema>) => {
        postMutation({ heading: data.heading, content: data.content, communityId: cid, postImage: data.postImage[0] })
    }
    const handleClose = () => {
        router.back();
    }



    return (
        <form onSubmit={handleSubmit(submitPost)} className="space-y-4">
            <div>
                <Label htmlFor="title" className="block text-xs font-bold dark:text-white bg-secondary-gray dark:bg-secondary-black rounded-full max-w-max py-2 px-4">
                    Add title here<span className="text-red-500">*</span>
                </Label>
                <Controller
                    name="heading"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <div>
                            <Input id="title" placeholder="Title" className="placeholder:text-gray-500 py-2 mt-2 rounded-xl" {...field} maxLength={64} />
                            {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
                        </div>
                    )}
                />

            </div>
            <div>
                <Label htmlFor="body" className="block text-xs font-bold dark:text-white  bg-secondary-gray dark:bg-secondary-black rounded-full max-w-max py-2 px-4">
                    Add content here<span className="text-red-500">*</span>
                </Label>
                <Controller
                    name="content"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <div>
                            <Textarea id="body" placeholder="Body" className="placeholder:text-gray-500 py-2 mt-2 min-h-[100px]  rounded-xl" {...field} maxLength={1024} />
                            {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
                        </div>
                    )}
                />

            </div>
            <div>
                <Label htmlFor="image-upload" className="block text-xs font-bold dark:text-white  bg-secondary-gray dark:bg-secondary-black rounded-full max-w-max py-2 px-4">
                    Add image here<span className="text-red-500">*</span>
                </Label>
                <div>
                    <Input id="image-upload" type="file" className="mt-2  rounded-xl" onChange={(e) => setValue('postImage', e.target.files)} />
                </div>



            </div>
            <div className="flex justify-end space-x-2">
                <Button type="submit" disabled={isPending} className="rounded-xl bg-blue-500 text-white hover:bg-blue-500">{isPending ? "Posting..." : "Post"}</Button>
                <Button variant="outline" onClick={handleClose} className="rounded-xl">Cancel</Button>
            </div>
        </form>
    )
}

export default CreatePost