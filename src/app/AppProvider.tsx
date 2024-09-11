'use client';

import { clientAccessToken } from '@/lib/http';
import React, { createContext, useContext, useEffect, useState } from 'react'

interface TrailerContextProps {
    videoUrl: string;
    isModalOpen: boolean;
    openTrailer: (videoUrl: string) => void;
    closeTrailer: () => void;
}

const TrailerContext = createContext<TrailerContextProps>({
    videoUrl: '',
    isModalOpen: false,
    openTrailer: () => { },
    closeTrailer: () => { },
});

export default function AppProvider({ children, initialAccessToken = '' }: {
    children: React.ReactNode,
    initialAccessToken?: string
}) {

    const [videoUrl, setVideoUrl] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openTrailer = (url: string) => {
        setVideoUrl(url);
        setIsModalOpen(true);
    };

    const closeTrailer = () => {
        setIsModalOpen(false);
        setVideoUrl('');
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            clientAccessToken.value = initialAccessToken;
        }
    }, [initialAccessToken]);

    return (
        <TrailerContext.Provider value={{ videoUrl, isModalOpen, openTrailer, closeTrailer }}>
            {children}
        </TrailerContext.Provider>
    )
}

export const useTrailer = () => useContext(TrailerContext);