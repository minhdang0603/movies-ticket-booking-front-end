'use server'

import cinemaApiRequest from "@/apiRequests/cinema";
import mapboxApiRequest from "@/apiRequests/mapbox";
import showApiRequest from "@/apiRequests/show";
import { cookies } from "next/headers";

type ShowProps = {
    date: string,
    movieId?: string,
    cinemaId?: string,
    cityId?: string
}

type Location = {
    latitude: number,
    longitude: number
}

export const getCinemasByCityAndMovie = async (cityId: string, movieId?: string, date?: string) => {
    const res = await cinemaApiRequest.getCinemasByCityAndMovie(cityId, movieId, date);
    return res.payload.data;
}

export const getShows = async (props: ShowProps) => {
    const res = await showApiRequest.getShows(props);
    return res.payload.data;
}

export const searchAddress = async (address: string, accessToken: string) => {
    try {
        const res = await mapboxApiRequest.searchAddress(address, accessToken);
        return res.payload;
    } catch (error) {
        console.log(error);
    }
}

export const navigate = async (accessToken: string, start: Location, end: Location) => {
    try {
        const res = await mapboxApiRequest.navigate(accessToken, start, end);
        return res.payload;
    } catch (error) {
        console.log(error);
    }
}

export const getAllCities = async (movieId?: string) => {
    const res = await cinemaApiRequest.getAllCity(movieId);
    return res.payload.data;
}