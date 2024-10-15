import http from "@/lib/http";
import { MovieListResType, MovieResType } from "@/schemaValidations/movie.schema";

const movieApiRequest = {
    getNowShowingList: () => http.get<MovieListResType>('/movies/now-showing', { cache: 'no-store' }),
    getComingSoonList: () => http.get<MovieListResType>('/movies/coming-soon', { cache: 'no-store' }),
    getMovieById: (movieId: string) => http.get<MovieResType>(`/movies/${movieId}`)
}

export default movieApiRequest;