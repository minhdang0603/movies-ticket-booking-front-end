'use client'

import { BookingListResType } from '@/schemaValidations/booking.schema';

interface BookingHistoryProps {
    bookings: BookingListResType['data'];
}

const BookingHistory: React.FC<BookingHistoryProps> = ({ bookings }) => {
    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        };

        return date.toLocaleString('vi-VN', options);
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-4">
            {bookings.length > 0 ? (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="p-4 bg-white dark:bg-gray-800 shadow rounded-md">
                            <h3 className="font-bold text-lg">{booking.movie.title}</h3>
                            <p className="text-sm text-gray-500">
                                <span>Thời gian đặt vé:</span> {formatDateTime(booking.bookingTime)}
                            </p>
                            <p className="text-sm text-gray-500">
                                <span>Ngày chiếu:</span> {formatDateTime(booking.showDate)}
                            </p>
                            <p className="text-sm text-gray-500">
                                <span>Suất chiếu:</span> {booking.showTime.slice(0, 5)}
                            </p>
                            <p className="text-sm text-gray-500">
                                <span>Rạp:</span> {booking.cinema.name}
                            </p>
                            <p className="text-sm text-gray-500">
                                <span>Phụ đề:</span> {booking.audio.type}
                            </p>
                            <p className="text-sm text-gray-500">
                                <span>Số vé:</span> {booking.numberOfTicket}
                            </p>
                            <p className="text-sm text-gray-500">
                                <span>Giá vé:</span> {booking.price} VND
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <h3 className="text-center text-sm font-normal not-italic text-gray-400">
                    Chưa có giao dịch nào
                </h3>
            )}
        </div>
    );
};

export default BookingHistory;
