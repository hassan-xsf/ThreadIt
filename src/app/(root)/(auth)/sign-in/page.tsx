"use client"

import { signInSchema } from '@/schemas/signInSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AxiosError } from 'axios'

import { Button } from "@/components/ui/Button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import GithubSignIn from '@/components/ui/GithubSignIn'


const page = () => {

    const router = useRouter();
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            password: "",
            email: ""
        }
    });
    async function onSubmit(values: z.infer<typeof signInSchema>) {

        try {
            const data = await signIn('credentials', {
                redirect: false,
                email: values.email,
                password: values.password
            })
            if (data?.error) {
                if (data.error === "CredentialsSignin") {
                    return toast.error("Invalid credentials!")
                }
                return toast.error("There was a problem signing you up!")
            }
            toast.success("You have been logged in!")
            router.push("/")
            router.refresh();

        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message || "There was an error logging you in!")
            }
        }

    }
    return (
        <div className="w-1/3 mx-auto mt-40">
            <div className="mb-10 text-xl font-bold">Sign In</div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your email..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your password..." {...field} type="password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Link className="block" href="/sign-up">Don't have an account?</Link>

                    <Button type="submit">Sign In</Button>
                    <GithubSignIn />
                </form>
            </Form>
        </div >
    )
}

export default page