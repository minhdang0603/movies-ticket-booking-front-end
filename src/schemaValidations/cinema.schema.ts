import { z } from "zod";

export const CitySchema = z.object({
    id: z.string(),
    name: z.string()
});

export const CityRes = z.object({
    code: z.number(),
    data: z.array(CitySchema)
});

export type CityResType = z.TypeOf<typeof CityRes>

export const CinemaSchema = z.object({
    cinemaId: z.string(),
    name: z.string(),
    address: z.string(),
    latitude: z.string(),
    longitude: z.string(),
    fax: z.string(),
    hotline: z.string(),
    city: CitySchema,
    images: z.array(z.string())
});

export const CinemasListRes = z.object({
    code: z.number(),
    data: z.array(CinemaSchema)
});

export type CinemasListResType = z.TypeOf<typeof CinemasListRes>

export const CinemaRes = z.object({
    code: z.number(),
    data: CinemaSchema
});

export type CinemaResType = z.TypeOf<typeof CinemaRes>

