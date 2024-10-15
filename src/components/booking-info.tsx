'use client'

import { handleErrorApi, normalizeTitle } from '@/lib/utils'
import { ShowResType } from '@/schemaValidations/show.schema'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import Image from 'next/image'
import React, { useState } from 'react'
import { CheckCircleIcon, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import accountApiRequest from '@/services/user'
import bookingApiRequest from '@/services/booking'
import paymentApiRequest from '@/services/payment'
import mailApiRequest from '@/services/mail'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

export default function BookingInfo({ show }: {
    show: ShowResType['data']
}) {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [numberOfTickets, setNumberOfTickets] = useState(1);

    // Handlers for incrementing and decrementing ticket number
    const handleIncrease = () => {
        setNumberOfTickets((prev) => prev + 1);
    }

    const handleDecrease = () => {
        if (numberOfTickets > 1) {
            setNumberOfTickets((prev) => prev - 1);
        }
    }

    const formatPrice = (price: number, locale: string = 'vi-VN', currency: string = 'VND'): string => {
        return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(price);
    }

    const calculateTotal = (price: number) => formatPrice(price * numberOfTickets);

    const handleOrder = async () => {
        if (loading) return;
        setLoading(true);
        const userResponse = await accountApiRequest.myInfoClient();
        const day = new Date();
        try {
            const bookingCreationBody = {
                bookingTime: day.toLocaleString(),
                numberOfTicket: numberOfTickets,
                userId: userResponse.payload.data.userId,
                showId: show.id
            };
            console.log("Booking time: " + bookingCreationBody.bookingTime);

            const bookingResponse = await bookingApiRequest.createBooking(bookingCreationBody);
            console.log(bookingResponse.payload.data);

            const paymentCreationBody = {
                amount: (show.price * numberOfTickets),
                payDate: day.toLocaleString(),
                bookingId: bookingResponse.payload.data.id
            };
            console.log("Payment date: " + paymentCreationBody.payDate);
            await paymentApiRequest.createPaymentClient(paymentCreationBody);
            await mailApiRequest.sendMail(bookingResponse.payload.data);

            router.push('/my-info');

            toast({
                description: (
                    <div className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" /> {/* Success icon */}
                        <span>Đặt vé thành công</span>
                    </div>
                )
            });

        } catch (error) {
            handleErrorApi({
                error
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='my-0 mx-auto screen1390:max-w-screen-xl xl:max-w-screen-screen1200 lg:max-w-4xl md:max-w-4xl py-7 md:px-4 px-4'>
            <div className='relative md:grid hidden grid-cols-3 md:gap-5 gap-3 lg:items-start'>
                <div className='col-span-1 drop-shadow-2xl h-96 relative'>
                    <Image
                        alt={show.movie.title}
                        src={show.movie.image}
                        fill
                        style={{
                            objectFit: 'cover'
                        }}
                        priority
                        className='border-2 rounded border-white lg:w-[320px] lg:h-[400px] w-full h-full'
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                <div className='col-span-2 flex flex-col'>
                    <div className='flex items-center'>
                        <h1 className='text-[16px] md:text-[20px] lg:text-[24px] font-bold text-black-10 mr-4'>
                            {normalizeTitle(show.movie.title)}
                        </h1>
                    </div>
                    <div className='flex items-center'>
                        <div className='text-base flex items-center not-italic'>
                            <span className='mr-2'>
                                {show.audio.type}
                            </span>
                            <span> - </span>
                            <div className='ml-2 inline-block'>
                                <span className='inline-flex items-center justify-center w-[38px] h-7 bg-orange-500 rounded text-base text-center text-white font-bold not-italic'>
                                    {show.movie.rated}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <div className='flex flex-nowrap text-base'>
                            <span className='inline-block h-8 py-[6px]'>Rạp: </span>
                            <span className='inline-block h-8 ml-4 py-[6px] capitalize not-italic font-bold text-gray-600'>{show.cinema.name}</span>
                        </div>
                        <div className='flex flex-nowrap items-center text-base'>
                            <span className='inline-block h-8 py-[6px]'>Suất: </span>
                            <span className='inline-block h-auto break-words ml-4 py-[6px] capitalize not-italic font-bold text-gray-600'>{show.startTime.slice(0, 5)}</span>
                            <span className='ml-2 mr-2'> - </span>
                            <span className='mr-1'>{format(show.date, 'EEEE', { locale: vi })}, </span>
                            <span className='capitalize not-italic font-bold text-gray-600'>{format(show.date, 'dd/MM/yyy', { locale: vi })}</span>
                        </div>
                        <div className='flex flex-nowrap items-center text-base'>
                            <span className='inline-block h-8 py-[6px]'>Số vé: </span>
                            <span className='inline-block h-8 ml-4 py-[6px] capitalize not-italic'>{numberOfTickets}</span>

                            <button
                                className='ml-4 py-1 px-2 hover:bg-gray-400 text-black rounded disabled:opacity-50'
                                onClick={handleDecrease}
                                disabled={numberOfTickets === 1}
                            >
                                <Minus size={16} />
                            </button>
                            <button
                                className='ml-2 py-1 px-2 hover:bg-gray-400 text-black rounded'
                                onClick={handleIncrease}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        <div className='my-4 border-t border-grey-60 border-dashed xl:block hidden'></div>
                        <div className='text-base xl:flex hidden justify-between col-span-3'>
                            <span className='inline-block h-8 py-[6px] text-grey-40 font-bold text-gray-600'>Tổng cộng: </span>
                            <span className='inline-block font-bold text-orange-500'>{calculateTotal(show.price)}</span>
                        </div>
                        <div className='text-base xl:flex hidden justify-between col-span-3 px-10 mt-5'>
                            <Button
                                className='border-orange-500 hover:bg-orange-500 text-center w-full'
                                variant={'outline'}
                                type='button'
                                onClick={handleOrder}
                            >
                                {loading ? (
                                    <svg
                                        className="animate-spin h-5 w-5 mr-3 text-inherit inline-block"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                ) : (
                                    'Đặt vé'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
