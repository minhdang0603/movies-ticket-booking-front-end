import movieApiRequest from '@/apiRequests/movie';
import React from 'react';
import MoviesList from '../movies-list';

export default async function NowShowingPage() {

    const nowShowingRes = await movieApiRequest.getNowShowingList();

    const nowShowingList = nowShowingRes.payload.data;

    return (
        <div className='flex flex-col justify-center container py-12 px-48 my-0 mx-auto space-y-10'>
            <h1 className='text-center text-2xl font-bold'>Phim Đang Chiếu</h1>
            <MoviesList moviesList={nowShowingList} />
        </div>
    );
}
