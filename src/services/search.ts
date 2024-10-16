import http from "@/lib/http";
import {
	SearchCinemaResType,
	SearchMovieResType,
} from "@/schemaValidations/search.schema";

const searchApiRequest = {
	searchMovie: (query: string) =>
		http.get<SearchMovieResType>(`/search/movie?query=${query}`),
	searchCinema: (query: string, lat: number, lon: number) =>
		http.get<SearchCinemaResType>(`/search/cinema?query=${query}&lat=${lat}&lon=${lon}`),
};

export default searchApiRequest;
