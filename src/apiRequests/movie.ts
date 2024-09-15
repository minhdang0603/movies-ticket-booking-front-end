import http from "@/lib/http";
import { MovieListResType, MovieResType } from "@/schemaValidations/movie.schema";

const movieApiRequest = {
    getNowShowingList: () => http.get<MovieListResType>('/movies/now-showing'),
    getComingSoonList: () => http.get<MovieListResType>('/movies/coming-soon'),
    getMovieById: (movieId: string) => http.get<MovieResType>(`/movies/${movieId}`)
}

export default movieApiRequest;