import cinemaApiRequest from '@/services/cinema';
import CinemaImageCarousel from '@/components/cinema-image-carousel';
import CinemaInfo from '@/components/cinema-info';

export default async function CinemaBookingPage({ params }: { params: { id: string } }) {
    const cinemaId = params.id;
    const cinemaResponse = await cinemaApiRequest.getCinemaById(cinemaId);
    const cinema = cinemaResponse.payload.data;
    const images = cinema.images;

    return (
        <div>
            <CinemaImageCarousel images={images} />
            <CinemaInfo cinema={cinema} />
        </div>
    );
}
