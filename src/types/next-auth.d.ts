import NextAuth from "next-auth/next";

declare module "next-auth" {
    interface User {
        id: string
    }
    interface Session {
        user: User & {
            id: string
        },
        token: {
            id: string
        }
    }
}