import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchPublicMovies } from "../../api/movie";
import { useNotification } from "../../hooks";
import NotFoundText from "../NotFoundText";
import MovieList from "./MovieList";
import Container from "../Container";

export default function SearchMovies() {
	const [movies, setMovies] = useState([]);
	const [resultNotFound, setResultNotFound] = useState(false);

	const [searchParams] = useSearchParams();
	const query = searchParams.get("title");
	const { updateNotification } = useNotification();

	const searchMovies = async (val) => {
		const { results, error } = await searchPublicMovies(val);

		console.log(error);
		if (error) return updateNotification("error", error);

		if (!results.length) {
			setResultNotFound(true);
			return setMovies([]);
		}
		setResultNotFound(false);
		setMovies([...results]);
	};

	useEffect(() => {
		if (!query.trim()) return;
		searchMovies(query);
	}, [query]);

	return (
		<div className="dark:bg-primary bg-white min-h-screen py-8">
			<Container classname="px-2 xl:p-0">
				<NotFoundText
					text="Record not found"
					visible={resultNotFound}></NotFoundText>
				<MovieList movies={movies}></MovieList>
			</Container>
		</div>
	);
}
