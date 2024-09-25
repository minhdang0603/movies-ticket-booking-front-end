import chatApiRequest from '@/apiRequests/chat';
import accountApiRequest from '@/apiRequests/user';
import ChatBox from '@/components/chat-box'
import { cookies } from 'next/headers';
import React from 'react'

export default async function ChatPage({ params }: {
  params: {
    id: string
  }
}) {

  const accessToken = cookies().get('accessToken');
  const recipientId = params.id;
  const recipientResponse = await accountApiRequest.getUserById(accessToken?.value ?? '', recipientId);
  const recipient = recipientResponse.payload.data;
  const myInfoResponse = await accountApiRequest.myInfo(accessToken?.value ?? '');
  const sender = myInfoResponse.payload.data;
  const messagesResponse = await chatApiRequest.getMessages(sender.email, recipient.email, accessToken?.value ?? '');
  const messageList = messagesResponse.payload.data;

  return (
    <div className='h-full'>
      <ChatBox recipientEmail={recipient.email} messageList={messageList} senderEmail={sender.email} recipientName={recipient.name}/>
    </div>
  )
}
