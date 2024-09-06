import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"

const loading = () => {
  return (
      <div className="min-h-screen bg-gray-100 dark:bg-primary-black animate-pulse">
        <div className="max-w-screen-xl mx-auto">
          {/* Banner skeleton */}
          <div className="h-32 bg-gray-200 dark:bg-zinc-950 relative">
            <div className="absolute -bottom-8 left-4 flex items-end">
              <Skeleton className="w-24 h-24 rounded-full" />
              <Skeleton className="w-40 h-8 ml-4 mb-2" />
            </div>
          </div>

          {/* Header skeleton */}
          <div className="bg-white dark:bg-zinc-950 shadow-sm p-4 flex items-center justify-end pt-8">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </div>

          <div className="flex mt-4">
            {/* Main content area */}
            <main className="flex-grow pr-4">
              {/* Sort dropdown skeleton */}
              <div className="bg-white dark:bg-zinc-950 p-2 rounded-md shadow-sm mb-4">
                <Skeleton className="h-9 w-32" />
              </div>

              {/* Posts skeleton */}
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white dark:bg-zinc-950 p-4 rounded-md shadow-sm mb-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </main>

            {/* Sidebar skeleton */}
            <aside className="w-80">
              <div className="bg-white dark:bg-zinc-950 p-4 rounded-md shadow-sm mb-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex justify-between">
                  {[...Array(3)].map((_, index) => (
                    <div key={index}>
                      <Skeleton className="h-5 w-12 mb-1" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-950 p-4 rounded-md shadow-sm">
                <Skeleton className="h-6 w-1/2 mb-2" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    )
  }

export default loading