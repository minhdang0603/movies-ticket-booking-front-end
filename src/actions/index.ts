'use server'

import cinemaApiRequest from "@/apiRequests/cinema";
import showApiRequest from "@/apiRequests/show";

type ShowProp = {
    date: string,
    movieId?: string,
    cinemaId?: string,
    cityId?: string
}

export const getCinemasByCityAndMovie = async (cityId: string, movieId?: string, date?: string) => {
    const res = await cinemaApiRequest.getCinemasByCityAndMovie(cityId, movieId, date);
    return res.payload.data;
}

export const getShows = async (props: ShowProp) => {
    const res = await showApiRequest.getShows(props);
    return res.payload.data;
}