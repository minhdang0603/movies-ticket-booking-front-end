import { z } from "zod";
import { UserRes } from "./user.schema";

export const MessageSchema = z.object({
    id: z.string(),
    sender: UserRes,
    recipient: UserRes,
    content: z.string(),
    timestamp: z.date()
});

export const MessageListRes = z.object({
    code: z.number(),
    data: z.array(MessageSchema)
});

export type MessageListResType = z.TypeOf<typeof MessageListRes>

export const MessageNotificationSchema = z.object({
    id: z.string(),
    sender: UserRes,
    recipient: UserRes,
    content: z.string()
});

export const MessageNotificationRes = z.object({
    code: z.number(),
    data: MessageNotificationSchema
});

export type MessageNotificationResType = z.TypeOf<typeof MessageNotificationRes>

export const MessageBody = z.object({
    senderId: z.string(),
    recipientId: z.string(),
    content: z.string(),
    timestamp: z.date()
});

export type MessageBodyType = z.TypeOf<typeof MessageBody>
