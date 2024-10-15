'use client'

import authApiRequest from '@/services/auth'
import { clientAccessToken } from '@/lib/http';
import { decodeJWT } from '@/lib/utils';
import { PayloadJWT } from '@/type';
import React, { useEffect } from 'react';
import { differenceInMinutes } from 'date-fns';

export default function RefreshToken() {
    useEffect(() => {
        const interval = setInterval(async () => {
            const now = new Date();
            const expireAt = new Date(clientAccessToken.expireAt);


            if (clientAccessToken.value && differenceInMinutes(now, expireAt) < 10) {
                console.log(1);

                const res = await authApiRequest.refreshTokenFromNextClientToNextServer();
                const newAccessToken = res.payload.data.token;
                const payload = decodeJWT<PayloadJWT>(newAccessToken);
                clientAccessToken.expireAt = new Date(payload.exp * 1000).toISOString();
            }
        }, 1000 * 60 * 5);

        return () => clearInterval(interval);
    }, []);
    return null;
}
