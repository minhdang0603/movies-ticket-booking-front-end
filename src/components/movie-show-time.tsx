"use client";

import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { CinemaResType, CityResType } from "@/schemaValidations/cinema.schema";
import { getCinemasByCityAndMovie, getShows } from "@/actions";
import { Separator } from "@/components/ui/separator";
import { ShowListResType, ShowSchema } from "@/schemaValidations/show.schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

type Cinema = CinemaResType["data"];

type ShowsList = ShowListResType["data"];

type Show = z.TypeOf<typeof ShowSchema>;

interface GroupedShows {
	[cinemaId: string]: {
		cinema: Cinema;
		audioGroups: {
			[audioId: string]: {
				audio: Show["audio"];
				shows: Show[];
			};
		};
	};
}

export default function MovieShowTime({
	cityList,
	movieId,
}: {
	cityList: CityResType["data"];
	movieId: string;
}) {
	const today = new Date();
	const [selectedDate, setSelectedDate] = useState<Date>(today);
	const [selectedCityId, setSelectedCityId] = useState(cityList[0].id);
	const [cinemas, setCinemas] = useState<Cinema[]>([]);
	const [selectedCinemaId, setSelectedCinemaId] = useState<string>("0");
	const [shows, setShows] = useState<ShowsList>([]);

	const days = Array.from({ length: 7 }, (_, i) => {
		const day = new Date(today);
		day.setDate(today.getDate() + i);
		return day;
	});

	useEffect(() => {
		setSelectedCinemaId("0");
		const updateCinema = async () => {
			const res = await getCinemasByCityAndMovie(
				selectedCityId,
				movieId,
				format(selectedDate, "dd/MM/yyyy")
			);
			setCinemas(res);
		};

		updateCinema();
	}, [selectedCityId, selectedDate, movieId]);

	useEffect(() => {
		const listShows = async () => {
			let res;
			if (selectedCinemaId === "0") {
				res = await getShows({
					date: format(selectedDate, "dd/MM/yyyy"),
					movieId,
					cityId: selectedCityId,
				});
			} else {
				res = await getShows({
					date: format(selectedDate, "dd/MM/yyyy"),
					movieId,
					cinemaId: selectedCinemaId,
				});
			}

			setShows(res);
		};

		listShows();
	}, [selectedCityId, selectedCinemaId, selectedDate, movieId]);

	const showsByCinema = shows.reduce<GroupedShows>((acc, show) => {
		const cinemaId = show.cinema.cinemaId;
		const audioId = show.audio.id;

		// If the cinema group doesn't exist, create it
		if (!acc[cinemaId]) {
			acc[cinemaId] = {
				cinema: show.cinema,
				audioGroups: {},
			};
		}

		// If the audio group within the cinema doesn't exist, create it
		if (!acc[cinemaId].audioGroups[audioId]) {
			acc[cinemaId].audioGroups[audioId] = {
				audio: show.audio,
				shows: [],
			};
		}

		// Add the show to the appropriate audio group within the cinema
		acc[cinemaId].audioGroups[audioId].shows.push(show);

		acc[cinemaId].audioGroups[audioId].shows.sort((a, b) => {
			const [hoursA, minutesA, secondsA] = a.startTime.split(":").map(Number);
			const [hoursB, minutesB, secondsB] = b.startTime.split(":").map(Number);

			// Convert HH:mm:ss to seconds for comparison
			const timeA = hoursA * 3600 + minutesA * 60 + secondsA;
			const timeB = hoursB * 3600 + minutesB * 60 + secondsB;

			return timeA - timeB;
		});

		return acc;
	}, {});

	return (
		<div className="mt-3 lg:mt-0">
			<div>
				<span className="border-l-4 border-solid border-[#034ea2] mr-2"></span>
				<h1 className="mb-4 text-base inline-block capitalize font-bold">
					Lịch chiếu
				</h1>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-5 xl:grid-cols-12 items-center">
				<div className="order-2 sm:order-1 sm:col-span-6 md:col-span-6 xl:col-span-6 lg:col-span-6 mt-6 md:mt-0">
					<div className="grid grid-cols-4">
						{days.slice(0, 4).map((day, index) => (
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
				<div className="order-1 sm:order-2 sm:col-span-3 md:col-span-3 xl:col-span-6 lg:col-span-2 grid grid-cols-2 ml-5">
					<div className="col-span-1">
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
							value={selectedCinemaId}
							onValueChange={(value) => setSelectedCinemaId(value)}
						>
							<SelectTrigger className="w-[180px] cursor-pointer">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="0" className="cursor-pointer">
									Tất cả rạp
								</SelectItem>
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
			<Separator className="w-full h-[2px] bg-[#034ea2] my-4" />
			<div>
				{shows.length > 0 ? (
					Object.values(showsByCinema).map((cinemaGroup, cinemaIndex) => (
						<div
							className="md:py-8 py-4 px-3 odd:bg-white even:bg-[#FDFBFA] even:border-t even:border-b"
							key={cinemaIndex}
						>
							<h1 className="text-base font-bold mb-4">
								{cinemaGroup.cinema.name}
							</h1>
							{Object.values(cinemaGroup.audioGroups).map(
								(audioGroup, audioIndex) => (
									<div
										className="flex md:flex-row flex-col gap-2 items-start mb-6"
										key={audioIndex}
									>
										<label className="text-sm font-semibold text-grey-10 mt-2 w-[150px]">
											{audioGroup.audio.type}
										</label>
										<div className="flex flex-1 flex-row gap-x-3 gap-y-1 flex-wrap">
											{audioGroup.shows.map((show, showIndex) => (
												<Link
													href={`/booking/${show.id}`}
													passHref
													key={showIndex}
												>
													<Button
														variant={"outline"}
														className="md:px-8 text-sm tracking-normal font-normal hover:bg-[#034ea2] active:bg-[#034ea2] transition-all duration-500 ease-in-out hover:text-white"
													>
														{show.startTime.toString().slice(0, 5)}
													</Button>
												</Link>
											))}
										</div>
									</div>
								)
							)}
						</div>
					))
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
	);
}
