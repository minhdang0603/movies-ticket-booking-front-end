import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "../ui/hover-card";
import { cookies } from "next/headers";
import cinemaApiRequest from "@/services/cinema";
import CinemaListHoverCard from "./cinema-list-hover-card";
import UserAvatar from "../user-avatar";
import { Search } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default async function UserHeader() {
	const cityApiResponse = await cinemaApiRequest.getAllCity();
	const cityList = cityApiResponse.payload.data;
	const accessToken = cookies().get("accessToken")?.value;

	return (
		<header className="bg-inherit dark:bg-gray-800 text-inherit p-4">
			<div className="container mx-auto flex justify-between items-center">
				<div className="flex space-x-4">
					<Link href="/" className="text-xl font-bold">
						My Cinema
					</Link>
				</div>

				<nav>
					<ul className="flex space-x-20">
						<li>
							<HoverCard>
								<HoverCardTrigger asChild>
									<Button variant="link" className="text-lg">
										Phim
									</Button>
								</HoverCardTrigger>
								<HoverCardContent className="w-full flex flex-col">
									<Link href={"/now-showing"} passHref>
										<Button
											variant={"ghost"}
											className="text-base text-center hover:text-orange-500"
										>
											Phim đang chiếu
										</Button>
									</Link>
									<Link href={"/coming-soon"} passHref>
										<Button
											variant={"ghost"}
											className="text-base px-4 py-2 text-center hover:text-orange-500"
										>
											Phim sắp chiếu
										</Button>
									</Link>
								</HoverCardContent>
							</HoverCard>
						</li>
						<li className="relative">
							<CinemaListHoverCard cityList={cityList} />
						</li>
					</ul>
				</nav>

				<div className="flex space-x-6">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button size={"sm"} variant={"ghost"}>
								<Search size={16} />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-auto" align="end">
							<Link href={"/search/movie"} passHref>
								<DropdownMenuItem className="cursor-pointer">
									Tìm phim
								</DropdownMenuItem>
							</Link>
							<Link href={"/search/cinema"} passHref>
								<DropdownMenuItem className="cursor-pointer">
									Tìm rạp
								</DropdownMenuItem>
							</Link>
						</DropdownMenuContent>
					</DropdownMenu>
					{accessToken ? (
						<UserAvatar />
					) : (
						<Link href="/login">
							<Button
								size={"sm"}
								variant={"link"}
								className="bg-inherit text-inherit"
							>
								Đăng nhập
							</Button>
						</Link>
					)}
				</div>
			</div>
		</header>
	);
}
