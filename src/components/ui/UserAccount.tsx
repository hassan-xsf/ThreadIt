
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
import UserAvatar from './UserAvatar';

interface UserAccountProps {
  image?: string | null;
  name?: string | null;
}

const UserAccount: React.FC<UserAccountProps> = ({ image, name }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserAvatar image={image} name={name} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 w-56 bg-white dark:bg-[#181C1F] rounded-md pb-4" align="end" forceMount>
        <DropdownMenuItem className="flex items-center gap-2 p-3">
          <div className="flex items-center gap-2">
            <UserAvatar image={image} name={name} />
            <div>
              <p className="text-sm font-medium">{name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">u/{name}</p>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/about" className="flex gap-2 my-2">
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