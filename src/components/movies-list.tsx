'use client'

import { useAppContext } from '@/app/context/AppProvider' 
import { Button } from '@/components/ui/button'
import { normalizeTitle } from '@/lib/utils'
import { MovieListResType } from '@/schemaValidations/movie.schema'
import { CirclePlay, Ticket } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function MoviesList({ moviesList }: {
    moviesList: MovieListResType['data']
}) {

    const { dispatch } = useAppContext();

    return (
        <>
            <ul className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7'>
                {moviesList.map(movie => (
                    <li key={movie.id} className='relative'>
                        {/* Container for the image and mask */}
                        <div className='relative overflow-hidden group cursor-pointer'>
                            <div className='relative w-full h-0 pb-[150%]'>
                                <Image
                                    src={movie.image}
                                    alt={movie.title}
                                    fill
                                    style={{
                                        objectFit: 'cover'
                                    }}
                                    className='rounded-lg'
                                    priority
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>

                            {movie.rated &&
                                <div className='absolute bottom-[6px] right-[6px]'>
                                    <span className='inline-flex items-center justify-center w-[38px] h-7 bg-[#f26b38] rounded text-sm text-center text-white font-bold not-italic'>
                                        {movie.rated}
                                    </span>
                                </div>
                            }
                            <div className='absolute inset-0 bg-[rgba(0,0,0,.5)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-lg'>
                                <div className='flex flex-col justify-center items-center w-full h-full gap-3'>
                                    <Link href={`/movies/${movie.id}`} className='text-white bg-[#f26b38] w-[120px] h-[40px] hover:bg-[#fb9440] rounded text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#fb9440] dark:focus:ring-[#fb9440]'>
                                        <Ticket className='me-1' size={16} />
                                        Mua vé
                                    </Link>
                                    <Button
                                        onClick={() => dispatch({type: 'OPEN_TRAILER', payload: movie.trailer})}
                                        type='button'
                                        variant={'ghost'}
                                        disabled={movie.trailer ? false : true}
                                        className='text-white hover:text-white w-[120px] h-[40px] border border-white hover:bg-[#fb9440]/80 hover:border-transparent rounded text-sm px-5 py-2.5 text-center inline-flex items-center justify-start dark:hover:bg-[#fb9440] dark:focus:ring-[#fb9440]'
                                    >
                                        <CirclePlay className='me-1' size={16} />
                                        Trailer
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className='mt-3 cursor-pointer'>
                            <h3 className='text-sm font-semibold'>
                                {normalizeTitle(movie.title)}
                            </h3>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}
