import { z } from "zod";

export const MovieSearchSchema = z.object({
	id: z.string(),
	title: z.string(),
	director: z.string(),
	actors: z.string(),
});

export const SearchMovieRes = z.object({
	code: z.number(),
	data: z.array(MovieSearchSchema),
});

export const CinemaSearchSchema = z.object({
	id: z.string(),
	name: z.string(),
	location: z.array(z.number()),
	distance: z.number(),
});

export const SearchCinemaRes = z.object({
	code: z.number(),
	data: z.array(CinemaSearchSchema),
});

export type SearchMovieResType = z.TypeOf<typeof SearchMovieRes>;
export type SearchCinemaResType = z.TypeOf<typeof SearchCinemaRes>;
