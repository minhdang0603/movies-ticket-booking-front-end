'use client';

import { useAppContext } from '@/app/AppProvider';
import React, { useState } from 'react';

const TrailerModal = () => {
    const { videoUrl, isModalOpen, dispatch } = useAppContext();
    const [isClosing, setIsClosing] = useState(false);


    const handleCloseModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            dispatch({type: 'CLOSE_TRAILER'});
        }, 300);
    };


    const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
    };

    if (!isModalOpen && !isClosing) return null;

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out ${isClosing ? 'opacity-0' : 'opacity-100'}`}
            onClick={handleCloseModal}
        >
            <div
                className={`w-full max-w-5xl transform transition-transform duration-300 ease-in-out ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
                onClick={handleModalClick}
            >
                <div className="relative w-full h-0 pb-[56.25%]">
                    <iframe
                        className="absolute inset-0 w-full h-full border-none"
                        src={videoUrl}
                        title="Trailer"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default TrailerModal;
