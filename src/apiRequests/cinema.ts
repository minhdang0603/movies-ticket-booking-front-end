import http from "@/lib/http";
import { CinemaResType, CinemasListResType, CityResType } from "@/schemaValidations/cinema.schema";

const cinemaApiRequest = {
    getAllCity: (movieId?: string) => http.get<CityResType>(`/cities${movieId ? `?movieId=${movieId}` : ''}`, { cache: 'no-store' }),
    getCinemasByCityAndMovie: (cityId: string, movieId?: string, date?: string) => http.get<CinemasListResType>(`/cinemas?cityId=${cityId}${movieId ? `&movieId=${movieId}` : ''}${date ? `&date=${date}` : ''}`, { cache: 'no-store' }),
    getCinemaById: (id: string) => http.get<CinemaResType>(`/cinemas/${id}`)
}

export default cinemaApiRequest;