'use client';

import React from 'react'
import { ModeToggle } from '../mode-toggle'
import { Button } from '../ui/button'
import { LogOut } from 'lucide-react'
import { handleErrorApi } from '@/lib/utils'
import authApiRequest from '@/apiRequests/auth'

export default function AdminHeader() {

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
        <header className="flex justify-end bg-inherit dark:bg-gray-800 text-inherit p-4 shadow-lg fixed top-0 left-0 right-0 z-10 ml-64">
            <div className="flex space-x-6 items-center">
                <Button
                    variant={'ghost'}
                    size={'icon'}
                    className='hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300'
                    onClick={handleLogout}
                >
                    <LogOut className='h-5 w-5 text-indigo-600' strokeWidth={1.75} />
                </Button>
                <ModeToggle />
            </div>
        </header>
    )
}
