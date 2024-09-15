'use client'

import { Card, CardContent } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CinemaResType, CityResType } from '@/schemaValidations/cinema.schema';
import { getCinemasByCityAndMovie, getShows } from '@/actions';

type Cinema = CinemaResType['data'];

export default function MovieShowFilter({ cityList, movieId }: {
  cityList: CityResType['data']
  movieId: string
}) {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [selectedCityId, setSelectedCityId] = useState(cityList[0].id);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [selectedCinemaId, setSelectedCinemaId] = useState<string>('0');

  const days = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(today);
    day.setDate(today.getDate() + i);
    return day;
  });

  useEffect(() => {

    setSelectedCinemaId('0');
    const updateCinema = async () => {
      const res = await getCinemasByCityAndMovie(selectedCityId, movieId, format(selectedDate, 'dd/MM/yyyy'));
      setCinemas(res);
    };

    updateCinema();

  }, [selectedCityId, selectedDate])

  useEffect(() => {

    const listShows = async () => {
      let res;
      if (selectedCinemaId === '0') {
        res = await getShows({
          date: format(selectedDate, 'dd/MM/yyyy'),
          movieId,
          cityId: selectedCityId
        });
      } else {
        res = await getShows({
          date: format(selectedDate, 'dd/MM/yyyy'),
          movieId,
          cinemaId: selectedCinemaId
        });
      }
    }

    listShows();

  }, [selectedCityId, selectedCinemaId, selectedDate])

  return (
    <div className='grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-5 xl:grid-cols-12 items-center'>
      <div className='order-2 sm:order-1 sm:col-span-6 md:col-span-6 xl:col-span-7 lg:col-span-7 px-7 mt-6 md:mt-0'>
        <div className="grid grid-cols-4">
          {days.slice(0, 4).map((day, index) => (
            <div
              key={index}
              className="cursor-pointer w-[100px]"
              onClick={() => setSelectedDate(day)}
            >
              <Card className={`text-center ${selectedDate?.toDateString() === day.toDateString() ? 'bg-blue-600 text-white' : ''} border-none shadow-none`}>
                <CardContent className="flex flex-col items-center justify-center capitalize p-4">
                  <span className="text-sm">
                    {index === 0 ? "Hôm nay" : format(day, 'EEEE', { locale: vi })}
                  </span>
                  <span className="text-xs">{format(day, 'dd/MM', { locale: vi })}</span>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <div className='order-1 sm:order-2 sm:col-span-3 md:col-span-3 xl:col-span-5 lg:col-span-2 grid grid-cols-2 ml-2 gap-8'>
        <div className='col-span-1'>
          <Select
            defaultValue={selectedCityId}
            onValueChange={(value) => setSelectedCityId(value)}
          >
            <SelectTrigger className="w-[180px] cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cityList.map((city, index) => (
                <SelectItem
                  className='cursor-pointer'
                  value={city.id}
                  key={index}
                >
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='col-span-1'>
          <Select
            value={selectedCinemaId}
            onValueChange={(value) => setSelectedCinemaId(value)}
          >
            <SelectTrigger className="w-[180px] cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='0'>Tất cả rạp</SelectItem>
              {cinemas?.map((cinema, index) => (
                <SelectItem
                  className='cursor-pointer'
                  value={cinema.cinemaId}
                  key={index}
                >
                  {cinema.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
