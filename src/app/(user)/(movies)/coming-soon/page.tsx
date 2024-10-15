import movieApiRequest from '@/services/movie';
import React from 'react'
import MoviesList from '@/components/movies-list';

export default async function ComingSoonPage() {

    const comingSoonRes = await movieApiRequest.getComingSoonList();
    const comingSoonList = comingSoonRes.payload.data;

    return (
        <div className='flex flex-col justify-center container py-12 px-48 my-0 mx-auto space-y-10'>
            <h1 className='text-center text-2xl font-bold'>Phim Sắp Chiếu</h1>
            <MoviesList moviesList={comingSoonList} />
        </div>
    )
}
