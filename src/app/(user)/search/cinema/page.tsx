"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SearchCinemaResType } from "@/schemaValidations/search.schema";
import searchApiRequest from "@/services/search";
import { X } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

export default function SearchCinemaPage() {
	const [keyword, setKeyword] = useState("");
	const [searchSuggest, setSearchSuggest] = useState<
		SearchCinemaResType["data"]
	>([]);
	const [myLocation, setMyLocation] = useState({ latitude: 0, longitude: 0 });

	useEffect(() => {
		const getCurrentLocation = () => {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(handleGeolocate, (error) => {
					console.error("Error getting location:", error);
				});
			} else {
				console.error("Geolocation is not supported by this browser.");
			}
		};

		getCurrentLocation();
	}, []);

	const handleGeolocate = (position: any) => {
		const { latitude, longitude } = position.coords;
		setMyLocation({ latitude, longitude });
	};
	const fetchSuggestions = async (searchTerm: string) => {
		if (!searchTerm) return;

		const res = await searchApiRequest.searchCinema(
			searchTerm,
			myLocation.latitude,
			myLocation.longitude
		);
		const cinemasWithDistance = res.payload.data.map((cinema) => {
			const distance = calculateDistance(
				myLocation.latitude,
				myLocation.longitude,
				cinema.location[1], // lat
				cinema.location[0] // lon
			);
			cinema.distance = distance;
			return cinema;
		});
		setSearchSuggest(cinemasWithDistance);
	};

	const searching = (e: ChangeEvent<HTMLInputElement>) => {
		const newKeyword = e.target.value;
		setKeyword(newKeyword);

		if (newKeyword) {
			fetchSuggestions(newKeyword);
		} else {
			setSearchSuggest([]); // Clear suggestions if input is empty
		}
	};

	const calculateDistance = (
		lat1: number,
		lon1: number,
		lat2: number,
		lon2: number
	) => {
		const R = 6371; // Radius of the Earth in kilometers
		const latDistance = (lat2 - lat1) * (Math.PI / 180);
		const lonDistance = (lon2 - lon1) * (Math.PI / 180);
		const a =
			Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
			Math.cos(lat1 * (Math.PI / 180)) *
				Math.cos(lat2 * (Math.PI / 180)) *
				Math.sin(lonDistance / 2) *
				Math.sin(lonDistance / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c; // Distance in kilometers
	};

	return (
		<div className="my-0 mx-auto xl:max-w-4xl lg:max-w-6xl gap-8 min-h-[300px]">
			<div className="border-b border-[#D0D0D0] relative">
				<input
					type="text"
					value={keyword}
					onChange={searching}
					placeholder="Tìm kiếm rạp trong vòng 5km..."
					className="w-full font-semibold not-italic placeholder:text-[#999999] px-3 py-2 outline-none text-[#333333]"
				/>
				{keyword && (
					<Button
						className="absolute top-[20%] right-2 text-2xl"
						variant={"link"}
						size={"icon"}
						onClick={() => {
							setKeyword("");
							setSearchSuggest([]);
						}}
					>
						<X className="text-[#333333]" />
					</Button>
				)}
			</div>
			<div className="py-4">
				{keyword && (
					<p className="text-sm font-semibold not-italic text-[#333333]">
						<span>{searchSuggest.length}</span>
						<span> kết quả tìm kiếm cho từ khóa: </span>
						<strong>{keyword}</strong>
					</p>
				)}
				<div className="py-8">
					{searchSuggest.map((s) => (
						<Link href={`/cinema/${s.id}`} passHref key={s.id}>
							<div className="my-1 py-2 px-1 hover:bg-gray-100 w-full flex justify-between">
								<span>{s.name}</span>
								<span>{s.distance ? `${s.distance.toFixed(2)} km` : ""}</span>
							</div>
							<Separator />
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
