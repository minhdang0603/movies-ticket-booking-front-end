import http from "@/lib/http";
import { MessageListResType } from "@/schemaValidations/chat.message.schema";

const chatApiRequest = {
    getMessages: (senderId: string, recipientId: string, accessToken: string) => http.get<MessageListResType>(`/messages/${senderId}/${recipientId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default chatApiRequest;