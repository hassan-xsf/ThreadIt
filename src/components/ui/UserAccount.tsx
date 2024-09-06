
import Image from 'next/image'
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from './Button';
import { Info, LogOut } from 'lucide-react';
import Link from 'next/link';
import LogoutBtn from './LogoutBtn';

interface UserAccountProps {
  image?: string | null;
  name?: string | null;
}

const UserAccount: React.FC<UserAccountProps> = ({ image, name }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer size-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
          {
            image ?
              <>
                <Image src={image} alt="user" />
              </>
              :

              <div>{name![0]}</div>
          }
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 w-56 bg-white dark:bg-[#181C1F] rounded-md pb-4" align="end" forceMount>
        <DropdownMenuItem className="flex items-center gap-2 p-3">
          <div className="flex items-center gap-2">
            <div className="cursor-pointer size-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
              {
                image ?
                  <>
                    <Image src={image} alt="user" />
                  </>
                  :

                  <div>{name![0]}</div>
              }
            </div>
            <div>
              <p className="text-sm font-medium">{name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">u/{name}</p>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/about" className = "flex gap-2 my-2">
            <Info className="size-6" />
            <span>About</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogoutBtn>
            <LogOut className="size-6" />
            <span>Log out</span>
          </LogoutBtn>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAccount