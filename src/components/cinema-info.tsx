"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
	getAllCities,
	getCinemasByCityAndMovie,
	getShows,
	searchAddress,
} from "@/actions";
import { Card, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { CinemaResType, CityResType } from "@/schemaValidations/cinema.schema";
import { ShowListResType, ShowSchema } from "@/schemaValidations/show.schema";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { MovieResType } from "@/schemaValidations/movie.schema";
import { z } from "zod";
import Image from "next/image";
import { normalizeTitle } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MapBox from "@/components/map";
import { useAppContext } from "@/app/AppProvider";

type ShowsList = ShowListResType["data"];

type Cinema = CinemaResType["data"];

type Movie = MovieResType["data"];

type Show = z.TypeOf<typeof ShowSchema>;

interface GroupedShows {
	[movieId: string]: {
		movie: Movie;
		audioGroups: {
			[audioId: string]: {
				audio: Show["audio"];
				shows: Show[];
			};
		};
	};
}

export default function CinemaInfo({
	cinema,
}: {
	cinema: CinemaResType["data"];
}) {
	const { cities } = useAppContext();
	const router = useRouter();
	const today = useMemo(() => new Date(), []);
	const [shows, setShows] = useState<ShowsList>([]);
	const [cinemas, setCinemas] = useState<Cinema[]>([]);
	const [selectedDate, setSelectedDate] = useState<Date>(today);
	const [activeMovieId, setActiveMovieId] = useState<string | null>(null);

	const toggleShowtimes = useCallback((movieId: string) => {
		setActiveMovieId((prevMovieId) =>
			prevMovieId === movieId ? null : movieId
		);
	}, []);

	const days = useMemo(
		() =>
			Array.from({ length: 7 }, (_, i) => {
				const day = new Date(today);
				day.setDate(today.getDate() + i);
				return day;
			}),
		[today]
	);

	useEffect(() => {
		let isMounted = true;

		const getCinema = async () => {
			const res = await getCinemasByCityAndMovie(cinema.city.id);
			setCinemas(res);
		};

		if (isMounted) {
			getCinema();
		}

		return () => {
			isMounted = false;
		};
	}, [cinema.city.id]);

	useEffect(() => {
		const listShows = async () => {
			const res = await getShows({
				date: format(selectedDate, "dd/MM/yyyy"),
				cinemaId: cinema.cinemaId,
			});
			setShows(res);
		};

		listShows();
		if (activeMovieId !== null) {
			setActiveMovieId(null);
		}
	}, [selectedDate, cinema.cinemaId, activeMovieId]);

	const showsByMovie = shows.reduce<GroupedShows>((acc, show) => {
		const movieId = show.movie.id;
		const audioId = show.audio.id;

		if (!acc[movieId]) {
			acc[movieId] = {
				movie: show.movie,
				audioGroups: {},
			};
		}

		if (!acc[movieId].audioGroups[audioId]) {
			acc[movieId].audioGroups[audioId] = {
				audio: show.audio,
				shows: [],
			};
		}

		acc[movieId].audioGroups[audioId].shows.push(show);

		acc[movieId].audioGroups[audioId].shows.sort((a, b) => {
			const [hoursA, minutesA, secondsA] = a.startTime.split(":").map(Number);
			const [hoursB, minutesB, secondsB] = b.startTime.split(":").map(Number);

			const timeA = hoursA * 3600 + minutesA * 60 + secondsA;
			const timeB = hoursB * 3600 + minutesB * 60 + secondsB;

			return timeA - timeB;
		});

		return acc;
	}, {});

	const handleCityChange = async (value: string) => {
		const res = await getCinemasByCityAndMovie(value);
		router.push(`/cinema/${res[0].cinemaId}`, { scroll: false });
	};

	return (
		<div>
			<div className="grid lg:grid-cols-3 grid-cols-1 grid-flow-row gap-y-6 lg:max-w-screen-xl my-0 mx-auto md:items-center px-[16px] py-6">
				<div className="col-span-2">
					<h1 className="text-xxl font-bold">{cinema.name}</h1>
					<p className="text-sm md:mt-5">
						<span className="text-grey-50">Địa chỉ: </span>
						{cinema.address}
					</p>
					<p className="text-sm md:mt-5">
						<span className="text-gray-600">Hotline: </span>
						{cinema.hotline}
					</p>
					<p className="text-sm md:mt-5">
						<span className="text-gray-600">Fax: </span>
						{cinema.fax}
					</p>
				</div>
				<div className="col-span-1 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 lg:flex-row gap-4 ml-2 flex-1">
					<div className="col-span-1">
						<Select
							value={cinema.city.id}
							onValueChange={(value) => handleCityChange(value)}
						>
							<SelectTrigger className="w-[180px] cursor-pointer">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{cities.map((city, index) => (
									<SelectItem
										className="cursor-pointer"
										value={city.id}
										key={index}
									>
										{city.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="col-span-1">
						<Select
							value={cinema.cinemaId}
							onValueChange={(value) =>
								router.push(`/cinema/${value}`, { scroll: false })
							}
						>
							<SelectTrigger className="w-[180px] cursor-pointer">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{cinemas?.map((cinema, index) => (
									<SelectItem
										className="cursor-pointer"
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
			<div className="bg-gray-50 md:py-8 w-screen">
				<div className="my-0 mx-auto items-center lg:max-w-screen-xl md:max-w-screen-lg md:px-4 sm:px-[45px] px-[16px] py-6">
					<div className="bg-white p-4">
						<div className="mb-4">
							<span className="border-l-4 border-solid border-[#034ea2] mr-2"></span>
							<div className="text-xl inline-block uppercase font-bold m-0">
								PHIM
							</div>
						</div>
						<div>
							<div className="overflow-x-scroll mt-7">
								<div className="flex justify-center space-x-5 capitalize text-center text-[14px] ">
									{days.map((day, index) => (
										<div
											key={index}
											className="cursor-pointer w-[90px]"
											onClick={() => setSelectedDate(day)}
										>
											<Card
												className={`text-center ${
													selectedDate?.toDateString() === day.toDateString()
														? "bg-[#034ea2] text-white"
														: ""
												} border-none shadow-none`}
											>
												<CardContent className="flex flex-col items-center justify-center capitalize px-1 py-4">
													<span className="text-sm">
														{index === 0
															? "Hôm nay"
															: format(day, "EEEE", { locale: vi })}
													</span>
													<span className="text-xs">
														{format(day, "dd/MM", { locale: vi })}
													</span>
												</CardContent>
											</Card>
										</div>
									))}
								</div>
							</div>
							<Separator className="w-full h-[2px] bg-[#034ea2] my-4" />
							{shows.length > 0 ? (
								<ul className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 relative md:gap-8 gap-2">
									{Object.values(showsByMovie).map((movieGroup, movieIndex) => (
										<li
											className="transition-all duration-300 ease-in-out"
											key={movieIndex}
										>
											<div
												className="relative text-center mb-2"
												onClick={() => toggleShowtimes(movieGroup.movie.id)}
											>
												<div className="relative cursor-pointer">
													<div className="inline-block w-full whitespace-nowrap relative mb-1 card__movies overflow-hidden">
														<div className="relative w-full h-0 pb-[150%]">
															<Image
																src={movieGroup.movie.image}
																alt={movieGroup.movie.title}
																fill
																style={{
																	objectFit: "cover",
																}}
																className="rounded-lg"
																priority
																sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
															/>
														</div>
														{movieGroup.movie.rated && (
															<div className="absolute bottom-[6px] right-[6px]">
																<span className="inline-flex items-center justify-center w-[38px] h-7 bg-[#f26b38] rounded text-sm text-center text-white font-bold not-italic">
																	{movieGroup.movie.rated}
																</span>
															</div>
														)}
													</div>
													<span className="text-sm">
														{normalizeTitle(movieGroup.movie.title)}
													</span>
												</div>
												{activeMovieId === movieGroup.movie.id && (
													<div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-12px]">
														<svg
															width="24"
															height="24"
															fill="#034ea2"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path d="M12 15.5L6 9.5L18 9.5L12 15.5Z" />
														</svg>
													</div>
												)}
											</div>
											{activeMovieId === movieGroup.movie.id && (
												<>
													<div className="absolute w-full left-0 z-10">
														<div className="bg-gray-50 border rounded px-4 py-6">
															<h4 className="text-base not-italic font-bold mb-4">
																Suất chiếu
															</h4>
															<div>
																{Object.values(movieGroup.audioGroups).map(
																	(audioGroup, audioIndex) => (
																		<div
																			className="grid md:grid-cols-8 grid-cols-1 grid-rows-5 md:grid-flow-row grid-flow-col items-center space-x-3"
																			key={audioIndex}
																		>
																			<div className="md:col-span-2 md:row-span-5 xl:col-span-1 text-sm text-black-20">
																				{audioGroup.audio.type}
																			</div>
																			<div className="md:col-span-6 xl:col-span-7  row-span-4 flex flex-wrap text-sm text-black-10 gap-2">
																				{audioGroup.shows.map(
																					(show, showIndex) => (
																						<Link
																							href={"/"}
																							passHref
																							key={showIndex}
																						>
																							<Button
																								variant={"outline"}
																								size={"icon"}
																								className="md:px-8 text-sm tracking-normal font-normal hover:bg-[#034ea2] active:bg-[#034ea2] transition-all duration-500 ease-in-out hover:text-white"
																							>
																								{show.startTime
																									.toString()
																									.slice(0, 5)}
																							</Button>
																						</Link>
																					)
																				)}
																			</div>
																		</div>
																	)
																)}
															</div>
														</div>
													</div>
													<div className="mt-1 h-[138px]"></div>
												</>
											)}
										</li>
									))}
								</ul>
							) : (
								<div className="pt-20 pb-10 py-5 text-center">
									<Image
										src={
											"https://www.galaxycine.vn/_next/static/media/video-camera.3c9f371d.png"
										}
										alt="Camera"
										className="inline object-cover duration-500 ease-in-out group-hover:opacity-100 scale-100 blur-0 grayscale-0)"
										width={80}
										height={80}
									/>
									<p className="text-sm text-[#777777] mt-3">
										Hiện tại phim chưa có lịch chiếu
									</p>
								</div>
							)}
						</div>
					</div>
					<div className="mt-8">
						<div className="bg-white p-4">
							<div className="mb-4">
								<span className="border-l-4 border-solid border-[#034ea2] mr-2"></span>
								<span className="text-xl inline-block uppercase font-bold m-0">
									Thông tin chi tiết
								</span>
							</div>
							<div>
								<ul>
									<li>
										<strong className="text-gray-500">Địa chỉ: </strong>
										<strong>{cinema.address}</strong>
									</li>
									<li>
										<strong className="text-gray-500">Số điện thoại: </strong>
										<strong>{cinema.hotline}</strong>
									</li>
								</ul>
								<div className="my-4">
									<MapBox
										latitude={cinema.latitude}
										longitude={cinema.longitude}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
