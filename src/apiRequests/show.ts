import http from "@/lib/http";
import { ShowListResType } from "@/schemaValidations/show.schema";

const showApiRequest = {
    getShows: ({ date, movieId, cinemaId, cityId }: {
        date: string,
        movieId?: string,
        cinemaId?: string,
        cityId?: string
    }) => http.get<ShowListResType>(`/shows?${movieId ? `movieId=${movieId}&` : ''}${cinemaId ? `cinemaId=${cinemaId}&` : ''}${cityId ? `cityId=${cityId}&` : ''}date=${date}`)
}

export default showApiRequest;