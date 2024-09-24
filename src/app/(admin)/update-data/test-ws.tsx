'use client';

import { clientAccessToken } from '@/lib/http';
import React, { useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import envConfig from '@/config';

export default function TestWs() {

    const stompClient = useRef<Client | null>(null);
    useEffect(() => {
        connect();
        return () => {
            if (stompClient.current) {
                stompClient.current.deactivate();
            }
        };
    }, []);

    const connect = () => {
        const client = new Client({
            webSocketFactory: () => new SockJS(envConfig.NEXT_PUBLIC_API_ENDPOINT + '/ws'),
            connectHeaders: {
                Authorization: `Bearer ${clientAccessToken.value}`
            },
            onConnect: () => {
                console.log('Connected');
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        client.activate();
        stompClient.current = client;
    };


    // const handleConnecting = () => {
    //     stompClient.current?.subscribe(`/`)
    //     stompClient.current?.publish()
    // }


    return (
        <div>

        </div>
    )
}
