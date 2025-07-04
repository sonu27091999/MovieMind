import React from "react";
import GridContainer from "../GridContainer";
import { AiFillStar } from "react-icons/ai";
import { Link } from "react-router-dom";
import RatingStar from "../RatingStar";
import { getPoster } from "../../utils/helper";

const trimTitle = (text = "") => {
	if (text.length <= 20) return text;
	return text.substring(0, 20) + "...";
};

export default function MovieList({ title, movies = [] }) {
	if (!movies.length) return null;
	return (
		<div>
			{title && (
				<h1 className="text-2xl dark:text-white text-secondary font-semibold mb-5">
					{title}
				</h1>
			)}
			<GridContainer>
				{movies.map((movie) => {
					return <ListItem key={movie.id} movie={movie}></ListItem>;
				})}
			</GridContainer>
		</div>
	);
}

const ListItem = ({ movie }) => {
	const { title, poster, reviews, id, responsivePosters } = movie;
	return (
		<Link to={"/movie/" + id}>
			<img
				className="aspect-video object-cover w-full"
				src={getPoster(responsivePosters) || poster}
				alt={title}></img>
			<h1
				className="text-lg dark:text-white text-secondary font-semibold"
				title={title}>
				{trimTitle(title)}
			</h1>
			<RatingStar rating={reviews.ratingAvg}></RatingStar>
		</Link>
	);
};
