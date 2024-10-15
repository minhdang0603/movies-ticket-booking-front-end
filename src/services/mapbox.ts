import http from "@/lib/http";
import { string } from "zod";

type Location = {
    latitude: number,
    longitude: number
}

const mapboxApiRequest = {
    searchAddress: (address: string, accessToken: string) => http.get<any>(`/search/geocode/v6/forward?q=${encodeURIComponent(address)}&access_token=${accessToken}&language=vi&country=VN&limit=1`, {
        baseUrl: "https://api.mapbox.com"
    }),
    navigate: (accessToken: string, start: Location, end: Location) => http.get<any>(
        `/directions/v5/mapbox/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?access_token=${accessToken}&geometries=geojson&steps=true&language=vi`, {
        baseUrl: "https://api.mapbox.com"
    }),
}

export default mapboxApiRequest;