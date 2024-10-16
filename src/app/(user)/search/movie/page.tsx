"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SearchMovieResType } from "@/schemaValidations/search.schema";
import searchApiRequest from "@/services/search";
import { X } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, useState } from "react";

export default function SearchMoviePage() {
	const [keyword, setKeyword] = useState("");
	const [searchSuggest, setSearchSuggest] = useState<
		SearchMovieResType["data"]
	>([]);

	const fetchSuggestions = async (searchTerm: string) => {
		if (!searchTerm) return;
		const res = await searchApiRequest.searchMovie(searchTerm);
		setSearchSuggest(res.payload.data);
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

	return (
		<div className="my-0 mx-auto xl:max-w-4xl lg:max-w-6xl gap-8 min-h-[300px]">
			<div className="border-b border-[#D0D0D0] relative">
				<input
					type="text"
					value={keyword}
					onChange={searching}
					placeholder="Tìm kiếm phim..."
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
				{keyword &&
					`${searchSuggest.length} Kết quả tìm kiếm cho từ khóa: ${keyword}`}
			</div>
			<div>
				{searchSuggest.map((s) => (
					<Link href={`/movies/${s.id}`} passHref key={s.id}>
						<div className="my-1 py-2 px-1 hover:bg-gray-100 w-full">
							{s.title}
						</div>
						<Separator />
					</Link>
				))}
			</div>
		</div>
	);
}
