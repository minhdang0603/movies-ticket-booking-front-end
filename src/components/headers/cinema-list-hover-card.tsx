'use client'

import { CinemaResType, CityResType } from '@/schemaValidations/cinema.schema'
import React, { useState } from 'react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'
import cinemaApiRequest from '@/apiRequests/cinema'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

type Cinema = CinemaResType['data'];

type CinemaMap = {
    [cityId: string]: Cinema[]; // cityId is a number, and the value is an array of cinemas
};

export default function CinemaListHoverCard({ cityList }: {
    cityList: CityResType['data']
}) {

    const [cinemas, setCinemas] = useState<CinemaMap>({});

    // Function to fetch cinemas for a city
    const fetchCinemas = async (cityId: string) => {
        if (!cinemas[cityId]) {
            const cinemaResponse = await cinemaApiRequest.getCinemasByCityAndMovie(cityId);
            setCinemas(prevState => ({
                ...prevState,
                [cityId]: cinemaResponse.payload.data
            }));
        }
    };

    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Button variant="link" className='text-lg'>
                    Tất cả rạp
                </Button>
            </HoverCardTrigger>
            <HoverCardContent className="h-72 w-auto min-w-[200px] flex flex-col rounded-md">
                <ScrollArea className="flex-1">
                    {cityList.map((city, index) => (
                        <div key={city.id} className='group'>
                            <HoverCard>
                                {index > 0 && <Separator className="my-2" />}
                                <HoverCardTrigger
                                    asChild
                                    onMouseEnter={() => fetchCinemas(city.id)}
                                >
                                    <div className="text-base cursor-pointer flex justify-between group-hover:text-orange-500">
                                        {city.name}
                                        <span className='mr-2 flex items-center'>
                                            <ChevronRight size={16} />
                                        </span>
                                    </div>
                                </HoverCardTrigger>
                                <HoverCardContent
                                    className="absolute top-[-35px] left-4 w-auto min-w-[200px] p-2 z-50"
                                    align='end'
                                    style={{
                                        maxHeight: cinemas[city.id]?.length > 6 ? '12rem' : 'auto',
                                        overflowY: cinemas[city.id]?.length > 6 ? 'auto' : 'visible'
                                    }}
                                >
                                    {cinemas[city.id] ? (
                                        <ScrollArea className={cinemas[city.id]?.length > 6 ? "h-full" : "h-auto"}>
                                            {cinemas[city.id].map((cinema, index) => (
                                                <Link href={`/cinema/${cinema.cinemaId}`} passHref key={cinema.cinemaId}>
                                                    {index > 0 && <Separator className="my-2" />}
                                                    <Button
                                                        variant={'ghost'}
                                                        className='text-sm flex justify-start w-full hover:text-orange-500'
                                                    >
                                                        {cinema.name}
                                                    </Button>
                                                </Link>
                                            ))}
                                        </ScrollArea>
                                    ) : (
                                        <div>Loading cinemas...</div>
                                    )}
                                </HoverCardContent>
                            </HoverCard>
                        </div>
                    ))}
                </ScrollArea>
            </HoverCardContent>
        </HoverCard>
    )
}
