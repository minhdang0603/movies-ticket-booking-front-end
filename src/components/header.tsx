import Link from 'next/link'
import React from 'react'
import { ModeToggle } from './mode-toggle'
import { Button } from './ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card'
import UserAvatar from './avatar'
import { cookies } from 'next/headers'

export default function Header() {

    const accessToken = cookies().get('accessToken')?.value;

    return (
        <header className="bg-inherit text-inherit p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex space-x-4">
                    <Link href="/" className="text-xl font-bold">
                        My Cinema
                    </Link>
                </div>

                <nav>
                    <ul className="flex space-x-20">
                        <li>
                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <Button variant="link" className='text-lg'>Phim</Button>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-70">
                                    <Link href={'/'} passHref>
                                        <Button variant={'ghost'} className='text-base px-4 py-2 text-center'>Phim đang chiếu</Button>
                                    </Link>
                                    <Link href={'/'} passHref>
                                        <Button variant={'ghost'} className='text-base px-4 py-2 text-center'>Phim sắp chiếu</Button>
                                    </Link>
                                </HoverCardContent>
                            </HoverCard>

                        </li>
                        <li>
                            <Link href="/" className="hover:text-gray-400 text-lg" passHref>
                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <Button variant="link" className='text-lg'>
                                            Tất cả phim
                                        </Button>
                                    </HoverCardTrigger>
                                </HoverCard>
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="flex space-x-6">
                    {
                        accessToken
                            ? <UserAvatar />
                            : <Link href="/login">
                                <Button size={'sm'} variant={'link'} className='bg-inherit text-inherit'>
                                    Login
                                </Button>
                            </Link>
                    }
                    <ModeToggle />
                </div>
            </div>
        </header>
    )
}
