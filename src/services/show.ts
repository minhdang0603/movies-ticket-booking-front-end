import http from "@/lib/http";
import { ShowListResType, ShowResType } from "@/schemaValidations/show.schema";

const showApiRequest = {
    getShows: ({ date, movieId, cinemaId, cityId }: {
        date?: string,
        movieId?: string,
        cinemaId?: string,
        cityId?: string
    }) => http.get<ShowListResType>(`/shows?${movieId ? `movieId=${movieId}&` : ''}${cinemaId ? `cinemaId=${cinemaId}&` : ''}${cityId ? `cityId=${cityId}&` : ''}${date ? `date=${date}` : ''}`, { cache: 'no-store' }),
    getShowById: (showId: string, accessToken: string) => http.get<ShowResType>(`/shows/${showId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default showApiRequest;