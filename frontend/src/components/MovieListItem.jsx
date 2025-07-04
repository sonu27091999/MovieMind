import React, { useState } from "react";
import { BsBoxArrowUpRight, BsPencilSquare, BsTrash } from "react-icons/bs";
import ConfirmModal from "./modals/ConfirmModal";
import { deleteMovie } from "../api/movie";
import { useNotification } from "../hooks";
import UpdateMovie from "./modals/UpdateMovie";
import { getPoster } from "../utils/helper";

const MovieListItem = ({ movie, afterDelete, afterUpdate }) => {
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [showUpdateModal, setShowUpdateModal] = useState(false);
	const [selectedMovieId, setSelectedMovieId] = useState(null);
	const [busy, setBusy] = useState(false);

	const { updateNotification } = useNotification();

	const handleOnDeleteConfirm = async () => {
		setBusy(true);
		const { message, error } = await deleteMovie(movie.id);
		setBusy(false);

		if (error) return updateNotification("error", error);
		hideConfirmModal();
		updateNotification("success", message);
		afterDelete(movie);
	};

	const handleOnEditClick = () => {
		setShowUpdateModal(true);
		setSelectedMovieId(movie.id);
	};

	const displayConfirmModal = () => {
		setShowConfirmModal(true);
	};

	const hideConfirmModal = () => {
		setShowConfirmModal(false);
	};

	const handleOnUpdate = (movie) => {
		afterUpdate(movie);
		setShowUpdateModal(false);
		setSelectedMovieId(null);
	};

	return (
		<>
			<MovieCard
				movie={movie}
				onDeleteClick={displayConfirmModal}
				onEditClick={handleOnEditClick}></MovieCard>
			<div className="p-0">
				<ConfirmModal
					title="Are you sure?"
					subtitle="This action will remove this movie permanently!"
					busy={busy}
					visible={showConfirmModal}
					onConfirm={handleOnDeleteConfirm}
					onCancel={hideConfirmModal}></ConfirmModal>
				<UpdateMovie
					movieId={selectedMovieId}
					visible={showUpdateModal}
					onSuccess={handleOnUpdate}></UpdateMovie>
			</div>
		</>
	);
};
const MovieCard = ({ movie, onDeleteClick, onEditClick, onOpenClick }) => {
	const { poster, title, genres = [], status, responsivePosters } = movie;
	return (
		<table className="w-full border-b ">
			<tbody>
				<tr>
					<td>
						<div className="w-24">
							<img
								className="w-full aspect-video"
								src={getPoster(responsivePosters) || poster}
								alt={title}></img>
						</div>
					</td>
					<td className="w-full pl-5">
						<div>
							<h1 className="text-lg font-semibold text-primary dark:text-white">
								{title}
							</h1>
							<div className="space-x-1">
								{genres.map((genre, index) => (
									<span
										className="text-xs text-primary dark:text-white"
										key={index}>
										{genre}
									</span>
								))}
							</div>
						</div>
					</td>
					<td className="px-5">
						<p className="text-primary dark:text-white">{status}</p>
					</td>
					<td>
						<div className="flex items-center space-x-3 text-primary dark:text-white text-lg">
							<button type="button" onClick={onDeleteClick}>
								<BsTrash></BsTrash>
							</button>
							<button type="button" onClick={onEditClick}>
								<BsPencilSquare></BsPencilSquare>
							</button>
							<button type="button" onClick={onOpenClick}>
								<BsBoxArrowUpRight></BsBoxArrowUpRight>
							</button>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	);
};

export default MovieListItem;
