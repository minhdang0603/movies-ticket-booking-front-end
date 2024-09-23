import showApiRequest from '@/apiRequests/show';
import { cookies } from 'next/headers';
import BookingInfo from './booking-info';
import { notFound } from 'next/navigation';

export default async function BookingPage({ params }: { params: { id: string } }) {

    const accessToken = cookies().get('accessToken');
    const showId = params.id;
    let show: any;
    try {
        const showResponse = await showApiRequest.getShowById(showId, accessToken?.value ?? '');
        show = showResponse.payload.data;
    } catch (error) {
        console.log(error);
    }

    return (
        <>
            <BookingInfo show={show} />
        </>
    )
}
