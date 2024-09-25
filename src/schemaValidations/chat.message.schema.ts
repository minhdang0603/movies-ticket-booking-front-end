import { z } from "zod";

export const MessageSchema = z.object({
    id: z.string(),
    senderEmail: z.string(),
    recipientEmail: z.string(),
    content: z.string(),
    timestamp: z.date()
});

export const MessageListRes = z.object({
    code: z.number(),
    data: z.array(MessageSchema)
});

export type MessageListResType = z.TypeOf<typeof MessageListRes>

export const MessageNotificationRes = z.object({
    code: z.number(),
    data: MessageSchema
});

export type MessageNotificationResType = z.TypeOf<typeof MessageNotificationRes>

export const MessageBody = z.object({
    senderEmail: z.string(),
    recipientEmail: z.string(),
    content: z.string(),
    timestamp: z.date()
});

export type MessageBodyType = z.TypeOf<typeof MessageBody>
