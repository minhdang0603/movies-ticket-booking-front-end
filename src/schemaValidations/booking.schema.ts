import { z } from "zod";
import { Role } from "./common.schema";
import { ShowSchema } from "./show.schema";

export const BookingSchema = z.object({
    id: z.string(),
    bookingTime: z.string(),
    numberOfTicket: z.number(),
    user: z.object({
        userId: z.string(),
        name: z.string(),
        email: z.string(),
        phone: z.string(),
        roles: z.array(Role)
    }),
    show: ShowSchema
});

export const BookingListRes = z.object({
    code: z.number(),
    data: z.array(BookingSchema)
});

export const BookingRes = z.object({
    code: z.number(),
    data: BookingSchema
});

export type BookingResType = z.TypeOf<typeof BookingRes>

export type BookingListResType = z.TypeOf<typeof BookingListRes>

export const BookingCreation = z.object({
    bookingTime: z.string(),
    numberOfTicket: z.number(),
    userId: z.string(),
    showId: z.string()
});

export type BookingCreationReq = z.TypeOf<typeof BookingCreation>