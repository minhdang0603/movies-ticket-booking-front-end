import chatApiRequest from '@/apiRequests/chat';
import accountApiRequest from '@/apiRequests/user';
import ChatBox from '@/components/chat-box';
import { cookies } from 'next/headers';
import React from 'react'

export default async function ChatPage() {
    const accessToken = cookies().get('accessToken');
    const myInfoResponse = await accountApiRequest.myInfo(accessToken?.value ?? '');
    const myInfo = myInfoResponse.payload.data;
    const messagesResponse = await chatApiRequest.getMessages(myInfo.email, 'admin@gmail.com', accessToken?.value ?? '');
    const messageList = messagesResponse.payload.data;
    return (
        <div className='h-[500px] max-w-3xl mx-auto'>
            <ChatBox recipientEmail={'admin@gmail.com'} messageList={messageList} senderEmail={myInfo.email} recipientName='Amind' />
        </div>
    )
}
