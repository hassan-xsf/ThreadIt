"use client"
import { useRouter } from 'next/navigation'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
  
import { Button } from '@/components/ui/Button';

const CommunityNotFound = () => {
    const router = useRouter();

    const handleRedirect = () => {
        router.push('/');
    }

    return (
        <AlertDialog open={true}>
            <AlertDialogContent className = "bg-white dark:bg-black">
                <AlertDialogHeader>
                    <AlertDialogTitle className = "text-red-500">Error 404: Community Not Found</AlertDialogTitle>
                    <AlertDialogDescription>
                        The community you're looking for doesn't exist!
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button onClick={handleRedirect} className = "bg-blue-400 rounded-xl hover:bg-blue-400">Okay</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default CommunityNotFound;
