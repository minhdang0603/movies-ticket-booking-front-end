'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import envConfig from '@/config';
import { clientAccessToken } from '@/lib/http';
import { MessageBody, MessageBodyType, MessageListResType } from '@/schemaValidations/chat.message.schema';
import { Separator } from './ui/separator';
import { CircleUserRound, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from './ui/form';

const ChatBox = ({ recipientEmail, messageList, senderEmail, recipientName }: {
    recipientEmail: string,
    messageList: MessageListResType['data'],
    senderEmail: string,
    recipientName: string
}) => {

    const [messages, setMessages] = useState<MessageListResType['data']>(messageList);

    const scrollRef = useRef<HTMLDivElement | null>(null);
    const stompClient = useRef<Client | null>(null);

    useEffect(() => {
        connect();
        scrollToBottom();
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
            onConnect: handleConnected,
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        client.activate();
        stompClient.current = client;
    };

    const onSubmit = (values: MessageBodyType) => {
        if (values.content.trim() === '') return;

        const newMessage = [
            {
                id: '1',
                senderEmail,
                recipientEmail,
                content: values.content.trim(),
                timestamp: new Date()
            }
        ];

        setMessages(pre => [
            ...pre,
            ...newMessage
        ]);

        if (values.content && stompClient.current) {
            stompClient.current.publish({
                destination: "/app/chat",
                body: JSON.stringify({
                    senderEmail: senderEmail,
                    recipientEmail: recipientEmail,
                    content: values.content.trim(),
                    timestamp: new Date()
                })
            });
            console.log("Message sent");
        }

        form.reset();
    };

    const handleConnected = () => {
        stompClient.current?.subscribe(`/user/${senderEmail}/queue/messages`, onMessageReceived);
    };

    const onMessageReceived = (payload: IMessage) => {
        const messageData = JSON.parse(payload.body);

        setMessages(pre => [
            ...pre,
            messageData
        ]);
    };

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current!.scrollTop = scrollRef.current!.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const form = useForm<MessageBodyType>({
        resolver: zodResolver(MessageBody),
        defaultValues: {
            content: '',
            senderEmail: senderEmail,
            recipientEmail: recipientEmail,
            timestamp: new Date()
        },
    });

    return (
        <Card className="w-full h-full shadow-lg">
            <CardContent className="p-4 h-full flex flex-col justify-between">
                <div className="mb-2 space-x-2 flex">
                    <CircleUserRound />
                    <h2 className="text-lg font-semibold">{recipientName}</h2>
                </div>

                <Separator />

                <div
                    className="chat-container h-72 rounded-md p-4 mb-4 flex-1 overflow-scroll"
                    ref={scrollRef}
                >
                    {messages.length > 0 && (
                        <div className="space-y-2" >
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.senderEmail === senderEmail ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`${message.senderEmail === senderEmail ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
                                            } p-2 rounded-lg max-w-xs`}
                                    >
                                        {message.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Input and send button aligned at the bottom */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex w-full space-x-2'>
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem className='flex-1'>
                                    <FormControl>
                                        <Input
                                            placeholder="Type a message..."
                                            className="flex-1"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <Button type='submit' variant="outline">
                            <Send className="w-5 h-5 mr-2" />
                            Send
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default ChatBox;
