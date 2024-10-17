"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Client, IMessage } from "@stomp/stompjs";
import envConfig from "@/config";
import { clientAccessToken } from "@/lib/http";
import {
	MessageBody,
	MessageBodyType,
	MessageListResType,
} from "@/schemaValidations/chat.message.schema";
import { Separator } from "./ui/separator";
import { CircleUserRound, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import SockJS from "sockjs-client";

const ChatBox = ({
	recipientEmail,
	messageList,
	senderEmail,
	recipientName,
}: {
	recipientEmail: string;
	messageList: MessageListResType["data"];
	senderEmail: string;
	recipientName: string;
}) => {
	const [messages, setMessages] =
		useState<MessageListResType["data"]>(messageList);
	const scrollRef = useRef<HTMLDivElement | null>(null);
	const stompClient = useRef<Client | null>(null);

	const onSubmit = (values: MessageBodyType) => {
		if (values.content.trim() === "") return;

		const newMessage = [
			{
				id: "1",
				senderEmail,
				recipientEmail,
				content: values.content.trim(),
				timestamp: new Date(),
			},
		];

		setMessages((pre) => [...pre, ...newMessage]);

		form.reset();

		if (!stompClient.current?.connected) {
			return;
		}

		if (values.content.length > 0) {
			stompClient.current.publish({
				destination: "/app/chat.sendMessage",
				body: JSON.stringify({
					senderEmail: senderEmail,
					recipientEmail: recipientEmail,
					content: values.content.trim(),
					timestamp: new Date(),
				}),
			});
		}
	};

	const onMessageReceived = (payload: IMessage) => {
		const messageData = JSON.parse(payload.body);

		setMessages((pre) => [...pre, messageData]);
	};

	const scrollToBottom = () => {
		if (scrollRef.current) {
			scrollRef.current!.scrollTop = scrollRef.current!.scrollHeight;
		}
	};

	const handleConnected = () => {
		stompClient.current?.subscribe(
			`/user/${senderEmail}/queue/messages`,
			onMessageReceived
		);
	};

	const stompConfig = {
		webSocketFactory: () =>
			new SockJS(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/ws`),
		connectHeaders: {
			Authorization: clientAccessToken.value
				? `Bearer ${clientAccessToken.value}`
				: "",
			"ngrok-skip-browser-warning": "69430",
		},
		reconnectDelay: 2000,
		onConnect: handleConnected,
		onStompError: (error: any) => console.error("STOMP error:", error),
	};

	const connect = useCallback(() => {
		const client = new Client(stompConfig);
		client.activate();

		stompClient.current = client;
	}, [stompConfig]);

	useEffect(() => {
		connect();
		scrollToBottom();
		return () => {
			stompClient.current?.deactivate();
		};
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const form = useForm<MessageBodyType>({
		resolver: zodResolver(MessageBody),
		defaultValues: {
			content: "",
			senderEmail: senderEmail,
			recipientEmail: recipientEmail,
			timestamp: new Date(),
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
						<div className="space-y-2">
							{messages.map((message, index) => (
								<div
									key={index}
									className={`flex ${
										message.senderEmail === senderEmail
											? "justify-end"
											: "justify-start"
									}`}
								>
									<div
										className={`${
											message.senderEmail === senderEmail
												? "bg-blue-500 text-white"
												: "bg-gray-300 text-black"
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
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex w-full space-x-2"
					>
						<FormField
							control={form.control}
							name="content"
							render={({ field }) => (
								<FormItem className="flex-1">
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

						<Button
							type="submit"
							variant="outline"
							disabled={!stompClient.current?.connected}
						>
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
