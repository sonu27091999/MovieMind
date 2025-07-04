import React, { useEffect } from "react";
import MovieListItem from "../MovieListItem";
import NextAndPreviousButton from "../NextAndPreviousButton";
import { useMovies } from "../../hooks";

let currentPageNo = 0;
export default function Movies() {
	const {
		fetchMovies,
		movies: newMovies,
		fetchPrevPage,
		fetchNextPage,
	} = useMovies();

	const handleUIUpdate = () => fetchMovies();

	useEffect(() => {
		fetchMovies(currentPageNo);
	}, []);

	return (
		<>
			<div className="space-y-3 p-5">
				{newMovies.map((movie) => {
					return (
						<MovieListItem
							key={movie.id}
							movie={movie}
							afterDelete={handleUIUpdate}
							afterUpdate={handleUIUpdate}></MovieListItem>
					);
				})}
				<NextAndPreviousButton
					classname="mt-5"
					onNextClick={fetchNextPage}
					onPrevClick={fetchPrevPage}></NextAndPreviousButton>
			</div>
			{/* <ConfirmModal
				title="Are you sure?"
				subtitle="This action will remove this movie permanently!"
				busy={busy}
				visible={showConfirmModal}
				onConfirm={handleOnDeleteConfirm}
				onCancel={hideConfirmModal}></ConfirmModal>
			<UpdateMovie
				visible={showUpdateModal}
				onSuccess={handleOnUpdate}
				initialState={selectedMovie}
				onClose={hideUpdateForm}></UpdateMovie> */}
		</>
	);
}
