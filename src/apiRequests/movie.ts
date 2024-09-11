import http from "@/lib/http";
import { MovieResType } from "@/schemaValidations/movie.schema";

const movieApiRequest = {
    getNowShowingList: () => http.get<MovieResType>('/movies/now-showing'),
    getComingSoonList: () => http.get<MovieResType>('/movies/coming-soon'),
}

export default movieApiRequest;