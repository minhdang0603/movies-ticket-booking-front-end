import http from "@/lib/http";
import { BookingResType } from "@/schemaValidations/booking.schema";
import { MessageResType } from "@/schemaValidations/common.schema";

const mailApiRequest = {
    sendMail: (body: BookingResType['data']) => http.post<MessageResType>(`/mail/${body.user.email}`, body)
}

export default mailApiRequest;