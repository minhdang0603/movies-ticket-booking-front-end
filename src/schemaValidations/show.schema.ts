import { z } from "zod";
import { MovieSchema } from "./movie.schema";
import { CinemaSchema } from "./cinema.schema";

export const AudioSchema = z.object({
    id: z.number(),
    type: z.string()
});

export const ShowSchema = z.object({
    id: z.string(),
    date: z.string(),
    startTime: z.string(),
    price: z.number(),
    audio: AudioSchema,
    movie: MovieSchema,
    cinema: CinemaSchema
});

export const ShowListRes = z.object({
    code: z.number(),
    data: z.array(ShowSchema)
});

export type ShowListResType = z.TypeOf<typeof ShowListRes>