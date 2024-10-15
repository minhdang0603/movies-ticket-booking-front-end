import http from "@/lib/http";
import { BookingCreationReq, BookingListResType, BookingResType } from "@/schemaValidations/booking.schema";

const bookingApiRequest = {
    getBookingByUserId: (userId: string, accessToken: string) => http.get<BookingListResType>(`/bookings/${userId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    }),
    createBooking: (body: BookingCreationReq) => http.post<BookingResType>('/bookings', body)
}

export default bookingApiRequest;