import http from "@/lib/http";
import { CinemaResType, CinemasListResType, CityResType } from "@/schemaValidations/cinema.schema";

const cinemaApiRequest = {
    getAllCity: () => http.get<CityResType>('/cities'),
    getCinemaByCity: (cityId : string) => http.get<CinemasListResType>(`/cinemas?cityId=${cityId}`),
    getCinemaById: (id : string) => http.get<CinemaResType>(`/cinemas/${id}`)
}

export default cinemaApiRequest;