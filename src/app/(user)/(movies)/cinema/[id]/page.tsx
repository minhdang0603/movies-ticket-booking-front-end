import cinemaApiRequest from '@/services/cinema';
import CinemaImageCarousel from '@/components/cinema-image-carousel';
import CinemaInfo from '@/components/cinema-info';

export default async function CinemaBookingPage({ params }: { params: { id: string } }) {
    const cinemaId = params.id;
    const cinemaResponse = await cinemaApiRequest.getCinemaById(cinemaId);
    const cinema = cinemaResponse.payload.data;
    const citiesResponse = await cinemaApiRequest.getAllCity();
    const images = cinema.images;
    const cityList = citiesResponse.payload.data;
    const cinemaListResponse = await cinemaApiRequest.getCinemasByCityAndMovie(cityList[0].id);
    const cinemaList = cinemaListResponse.payload.data;

    return (
        <div>
            <CinemaImageCarousel images={images} />
            <CinemaInfo cinema={cinema} />
        </div>
    );
}
