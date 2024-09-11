"use client"

import { signUpSchema } from '@/schemas/signUpSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import GithubSignIn from '@/components/GithubSignIn'
import { X } from 'lucide-react'
import { signup } from '@/services/sign-up'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

const SignupPage = () => {

    const [isOpen, setIsOpen] = useState(true)
    const router = useRouter();
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            password: "",
            email: ""
        }
    });
    const closeModal = () => {
        if (isOpen) setIsOpen(false)
        router.push("/")
    }
    const signUp = useMutation({
        mutationFn: signup,
        onSuccess: () => {
            toast.success("Your account has been registered!")
            router.push("/sign-in")
        },
        onError: (error) => {
            if(error instanceof AxiosError) {
                return toast.error(error.message)
            }
            toast.error("There was a problem, Error code: 500")
        }
    })
    async function onSubmit(values: z.infer<typeof signUpSchema>) {
        if(!signUp.isPending) signUp.mutate(values)
    }
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-primary-black rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sign Up</h2>
                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6">
                    <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                        By continuing, you agree to our User Agreement and acknowledge that you understand the Privacy Policy.
                    </p>
                    <GithubSignIn />
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-primary-black text-gray-500 dark:text-white">OR</span>
                        </div>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="text" className="w-full rounded-xl" placeholder="Username" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="text" className="w-full rounded-xl" placeholder="Email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div>
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="Password" {...field} className="w-full rounded-xl" type="password" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" className="w-full">{signUp.isPending ? "Signing up.." : "Sign Up"}</Button>
                        </form>
                    </Form>
                    <div className="mt-4 text-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400"> </span>
                        <Link href="/sign-in" className="text-sm text-blue-600 hover:underline dark:text-blue-400">Don&apos;t have an account?</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignupPage