import { z } from "zod";
import { BookingSchema } from "./booking.schema";

export const PaymentSchema = z.object({
    id: z.string(),
    amount: z.number(),
    payDate: z.string(),
    booking: BookingSchema
});

export const PaymentRes = z.object({
    code: z.number(),
    data: PaymentSchema
});

export type PaymnetResType = z.TypeOf<typeof PaymentRes>

export const PaymentCreationReq = z.object({
    amount: z.number(),
    payDate: z.string(),
    bookingId: z.string(),
});

export type PaymentCreationReqType = z.TypeOf<typeof PaymentCreationReq>