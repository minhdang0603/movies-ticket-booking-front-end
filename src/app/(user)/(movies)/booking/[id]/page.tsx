import movieApiRequest from '@/apiRequests/movie';
import { normalizeTitle } from '@/lib/utils';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { Calendar, Clock4 } from 'lucide-react';
import Image from 'next/image';
import React from 'react'
import MovieShowFilter from './movie-show-filter';
import cinemaApiRequest from '@/apiRequests/cinema';

export default async function BookingPage({ params }: { params: { id: string } }) {

    const movieId = params.id;
    const movieResponse = await movieApiRequest.getMovieById(movieId);
    const movie = movieResponse.payload.data;
    const cityApiResponse = await cinemaApiRequest.getAllCity(movieId);
    const cityList = cityApiResponse.payload.data;

    return (
        <div>
            <AspectRatio ratio={21 / 6} className='bg-black flex items-center justify-center'>
                <div className='relative w-full h-full'>
                    <div className='absolute inset-0 flex items-center justify-center'>
                        <iframe
                            src={movie.trailer}
                            title='Movie Trailer'
                            className='w-full h-full border-none'
                            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                            allowFullScreen
                        />
                    </div>
                </div>
            </AspectRatio>
            <div className='my-0 mx-auto screen1390:max-w-screen-xl xl:max-w-screen-screen1200 lg:max-w-4xl md:max-w-4xl py-7 md:px-4 px-4'>
                <div className='w-full'>
                    <div className='flex flex-col space-y-10'>
                        <div className='relative md:grid hidden grid-cols-3 md:gap-5 gap-3 lg:items-start'>
                            <div className='col-span-1 drop-shadow-2xl h-96 relative'>
                                <Image
                                    alt={movie.title}
                                    src={movie.image}
                                    fill
                                    style={{
                                        objectFit: 'cover'
                                    }}
                                    priority
                                    className='border-2 rounded border-white lg:w-[320px] lg:h-[400px] w-full h-full'
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                            <div className='col-span-2 flex flex-col'>
                                <div className='flex items-center'>
                                    <h1 className='text-[16px] md:text-[20px] lg:text-[24px] font-bold text-black-10 mr-4'>

                                        {normalizeTitle(movie.title)}
                                    </h1>
                                    <span className='inline-flex items-center justify-center w-[38px] h-7 bg-orange-500 rounded text-sm text-center text-white font-bold not-italic'>
                                        {movie.rated}
                                    </span>
                                </div>
                                <div className='flex items-center'>
                                    <div className='text-sm flex items-center not-italic'>
                                        <Clock4
                                            size={14}
                                            className='inline-block align-baseline mr-1 text-orange-500'
                                        />
                                        <span>
                                            {movie.duration}
                                        </span>
                                    </div>
                                    <div className='text-sm ml-4 flex items-center not-italic'>
                                        <Calendar
                                            size={14}
                                            className='inline-block align-baseline mr-1 text-orange-500'
                                        />
                                        <span>{new Date(movie.releaseDate).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                        })}</span>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <div className='flex flex-nowrap text-sm'>
                                        <span className='inline-block h-8 py-[6px] text-grey-40'>Đạo diễn: </span>
                                        <span className='inline-block h-8 ml-4 py-[6px] capitalize not-italic'>{movie.director}</span>
                                    </div>
                                    <div className='flex flex-nowrap items-center text-sm'>
                                        <span className='inline-block h-8 py-[6px] text-grey-40'>Diễn viên: </span>
                                        <span className='inline-block flex-1 h-auto break-words ml-4 py-[6px] capitalize not-italic'>{movie.actors}</span>
                                    </div>
                                    <div className='flex flex-nowrap items-center text-sm'>
                                        <span className='inline-block h-8 py-[6px] text-grey-40'>Thể loại: </span>
                                        <span className='inline-block h-8 ml-4 py-[6px] capitalize not-italic'>{movie.genre}</span>
                                    </div>
                                    <div className='flex flex-nowrap items-center text-sm'>
                                        <span className='inline-block h-8 py-[6px] text-grey-40'>Ngôn ngữ: </span>
                                        <span className='inline-block h-8 ml-4 py-[6px] capitalize not-italic'>{movie.language}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mt-3 lg:mt-0'>
                            <span className='border-l-4 border-solid border-blue-600 mr-2'></span>
                            <h1 className='mb-4 text-base inline-block capitalize font-bold'>Nội dung phim</h1>
                            <div className='text-black-10 text-sm font-normal not-italic content-text'>
                                <p>
                                    <span>
                                        {movie.description}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className='mt-3 lg:mt-0'>
                            <div>
                                <span className='border-l-4 border-solid border-blue-600 mr-2'></span>
                                <h1 className='mb-4 text-base inline-block capitalize font-bold'>Lịch chiếu</h1>
                            </div>
                            <MovieShowFilter cityList={cityList} movieId={movie.id} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
