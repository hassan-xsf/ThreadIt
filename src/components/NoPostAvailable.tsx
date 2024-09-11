import { Frown, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Button } from '@/components/ui/button'

export default function NoPostsAvailable() {

    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center p-8 bg-white dark:bg-primary-black rounded-lg shadow-xl max-w-md w-full transform transition-all duration-300 ease-in-out hover:scale-105">
                <div className="inline-block mb-6 animate-bounce">
                    <Frown size={64} className="text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                    No Posts Available
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    We couldn't find any posts at the moment. Join some communities or create your own posts!
                </p>
                <div className="space-y-4">
                    <Link
                        href='/?feed=all'>
                        <Button
                            className="w-full text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors duration-200 group"
                        >
                            <RefreshCw size={16} className="mr-2 group-hover:animate-spin" />
                            Go Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}