import { Skeleton } from "@/components/ui/skeleton";

export function PostSkeleton() {
    return (
        <div className="w-[50vw] 2xl:w[40vw] min-w-96 mx-auto justify-center flex flex-row my-8 gap-4">
            <div className="bg-gray-100 dark:bg-black animate-pulse h-fit w-full rounded-md p-4">
                {/* Community Avatar Skeleton */}
                <div className="flex items-start space-x-2 mb-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <Skeleton className="w-24 h-4" />
                </div>

                {/* Post Header Skeleton */}
                <div className="flex items-center space-x-2 mb-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="w-32 h-4" />
                    <Skeleton className="w-16 h-4" />
                </div>

                {/* Post Title Skeleton */}
                <Skeleton className="w-3/4 h-6 mb-4" />

                {/* Post Image Skeleton */}
                <Skeleton className="w-full h-48 mb-4 rounded-md" />

                {/* Post Content Skeleton */}
                <Skeleton className="w-full h-4 mb-2" />
                <Skeleton className="w-5/6 h-4 mb-4" />

                {/* Votes and Interaction Buttons Skeleton */}
                <div className="flex space-x-4">
                    <Skeleton className="w-10 h-6" />
                    <Skeleton className="w-10 h-6" />
                    <Skeleton className="w-10 h-6" />
                </div>
            </div>
        </div>
    );
}