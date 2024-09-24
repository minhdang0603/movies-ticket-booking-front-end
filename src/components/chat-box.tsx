'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import envConfig from '@/config';
import { clientAccessToken } from '@/lib/http';
import { MessageListResType } from '@/schemaValidations/chat.message.schema';

const ChatBox = ({ recipientId, messages }: { recipientId: string, messages: MessageListResType['data'] }) => {

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

    const [inputMessage, setInputMessage] = useState('');


    // Create a ref for the ScrollArea to scroll to the bottom
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (inputMessage.trim() === '') return;

        const newMessage = { text: inputMessage, from: 'sender' };
        setInputMessage('');

        // Simulate bot response after a delay
        setTimeout(() => {

        }, 1000);
    };

    return (
        <Card className="w-full h-full shadow-lg">
            <CardContent className="p-4 h-full flex flex-col justify-between">
                {/* Scrollable message area */}
                <ScrollArea className="h-72 rounded-md p-4 mb-4 flex-1" ref={scrollRef}>
                    <div className="space-y-2">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.recipient.data.userId === recipientId ? 'justify-start' : 'justify-end'}`}
                            >
                                <div
                                    className={`${message.recipient.data.userId === recipientId ? 'bg-gray-300 text-white' : 'bg-blue-500 text-black'
                                        } p-2 rounded-lg max-w-xs`}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                {/* Input and send button aligned at the bottom */}
                <div className="flex space-x-2">
                    <Input
                        placeholder="Type a message..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        className="flex-1"
                    />
                    <Button onClick={handleSendMessage} variant="outline">
                        Send
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default ChatBox;
