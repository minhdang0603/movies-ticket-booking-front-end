'use client'

import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { LogOut, User, UserRound } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu'
import { DropdownMenuArrow, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import Link from 'next/link'
import authApiRequest from '@/apiRequests/auth'
import { handleErrorApi } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export default function UserAvatar() {

    const handleLogout = async () => {
        try {
            await authApiRequest.logoutFromNextClientToNextServer();
            location.href = '/login'
        } catch (error) {
            handleErrorApi({
                error
            })
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className='hover:cursor-pointer'>
                <Avatar>
                    <AvatarImage src="" alt="@shadcn" />
                    <AvatarFallback>
                        <UserRound strokeWidth={1.5} />
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='center'>
                <DropdownMenuArrow className="fill-current text-gray-800 dark:text-white" />
                <Link href={'/my-info'} passHref>
                    <DropdownMenuItem className='text-base'>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </DropdownMenuItem>
                </Link>
                <div onClick={handleLogout}>
                    <DropdownMenuItem className='text-base'>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
