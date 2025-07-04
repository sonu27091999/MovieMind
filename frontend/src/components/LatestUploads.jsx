import React, { useEffect } from "react";
import MovieListItem from "./MovieListItem";
import { useMovies } from "../hooks";

export default function LatestUploads() {
	const { fetchLatestUploads, latestUploads } = useMovies();

	const handleAfterDelete = () => {
		fetchLatestUploads();
	};

	const handleUIUpdate = () => fetchLatestUploads();

	useEffect(() => {
		fetchLatestUploads();
	}, []);

	return (
		<>
			<div className="bg-white shadow dark:bg-secondary p-5 rounded col-span-2">
				<h1 className="font-semibold text-2xl mb-2 text-primary dark:text-white">
					Recent Uploads
				</h1>
				<div className="space-y-3">
					{latestUploads.map((movie) => {
						return (
							<MovieListItem
								movie={movie}
								key={movie.id}
								afterDelete={handleAfterDelete}
								afterUpdate={handleUIUpdate}></MovieListItem>
						);
					})}
				</div>
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
