'use client'

import authApiRequest from '@/apiRequests/auth';
import { clientAccessToken } from '@/lib/http';
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

export default function Logout() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const accessToken = searchParams.get('accessToken');

    useEffect(() => {
        if (accessToken === clientAccessToken.value) {
            authApiRequest.logoutFromNextClientToNextServer(true)
                .then(res => {
                    location.href = '/login';
                })
        }

        return () => {
            clientAccessToken.value = '';
        }
    }, [accessToken, router])

    return (
        <>
        </>
    )
}
