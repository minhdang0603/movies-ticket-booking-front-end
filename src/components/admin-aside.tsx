import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { LayoutDashboard, User, Users } from 'lucide-react'

export default function AdminAside() {
    return (
        <aside className="w-64 bg-inherit dark:bg-gray-800 text-inherit shadow-lg p-4 h-full fixed left-0 top-0">
            <div className="h-full">
                <div className="flex-shrink-0">
                    <div className="text-2xl font-bold text-center mb-20 mt-3">
                        <span>My Cinema</span>
                    </div>
                    <nav>
                        <ul className="flex flex-col items-baseline space-y-5 w-full">
                            <li className='w-full'>
                                <Link href={'/dashboard'} passHref>
                                    <Button
                                        variant="ghost"
                                        className="w-full text-base justify-start space-x-3 group hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
                                    >
                                        <LayoutDashboard className="text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-600 transition-colors duration-300" />
                                        <span>
                                            Dashboard
                                        </span>
                                    </Button>
                                </Link>
                            </li>
                            <li className='w-full'>
                                <Link href={'/users'} passHref>
                                    <Button
                                        variant="ghost"
                                        className="w-full text-base justify-start space-x-3 group hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
                                    >
                                        <Users className="text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-600 transition-colors duration-300" />
                                        <span>
                                            Users
                                        </span>
                                    </Button>
                                </Link>
                            </li>
                            <li className='w-full'>
                                <Link href={'/profile'} passHref>
                                    <Button
                                        variant="ghost"
                                        className="w-full text-base justify-start space-x-3 group hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
                                    >
                                        <User className="text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-600 transition-colors duration-300" />
                                        <span>
                                            Profile
                                        </span>
                                    </Button>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </aside>
    )
}
