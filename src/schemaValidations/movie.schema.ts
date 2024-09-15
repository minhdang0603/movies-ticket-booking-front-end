import { z } from "zod";

export const MovieSchema = z.object({
    id: z.string(),
    title: z.string(),
    director: z.string(),
    actors: z.string(),
    description: z.string(),
    duration: z.string(),
    releaseDate: z.date(),
    genre: z.string(),
    rated: z.string(),
    status: z.string(),
    image: z.string().url(),
    trailer: z.string().url(),
    language: z.string()
});

export const MovieListRes = z.object({
    code: z.number(),
    data: z.array(MovieSchema),
});

export type MovieListResType = z.TypeOf<typeof MovieListRes>

export const MovieRes = z.object({
    code: z.number(),
    data: MovieSchema
});

export type MovieResType = z.TypeOf<typeof MovieRes>