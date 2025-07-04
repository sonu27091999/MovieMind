import React from "react";
import NotVerified from "./user/NotVerified";
import TopRatedMovies from "./user/TopRatedMovies";
import Container from "./Container";
import TopRatedWebSeries from "./user/TopRatedWebSeries";
import HeroSlideShow from "./user/HeroSlideShow";

export default function Home() {
	return (
		<div className="dark:bg-primary bg-white min-h-screen">
			<Container classname="px-2 xl:p-0">
				<NotVerified></NotVerified>
				<HeroSlideShow></HeroSlideShow>
				<div className="space-y-3 py-8">
					<TopRatedMovies></TopRatedMovies>
					<TopRatedWebSeries></TopRatedWebSeries>
				</div>
			</Container>
		</div>
	);
}
