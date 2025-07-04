import React, { useEffect, useState } from "react";
import ModalContainer from "./ModalContainer";
import genres from "../../utils/genres";
import Submit from "../form/Submit";

export default function GenresModal({
	visible,
	onClose,
	onSubmit,
	previousSelection,
}) {
	const [selectedGenres, setSelectedGenres] = useState([]);

	const handleGenresSelector = (genre) => {
		let newGenres = [];

		if (selectedGenres.includes(genre)) {
			newGenres = selectedGenres.filter((gen) => gen !== genre);
		} else {
			newGenres = [...selectedGenres, genre];
		}
		setSelectedGenres([...newGenres]);
	};

	const handleSubmit = () => {
		onSubmit(selectedGenres);
		onClose();
	};

	const handleClose = () => {
		setSelectedGenres(previousSelection);
		onClose();
	};

	useEffect(() => {
		setSelectedGenres(previousSelection);
	}, []);

	return (
		<ModalContainer visible={visible} onClose={handleClose}>
			<div className="flex flex-col justify-between h-full">
				<div>
					<h1
						className="dark:text-white text-primary text-2xl font-semibold
							text-center">
						Select Genres
					</h1>
					<div className="space-y-3">
						{genres.map((genre) => {
							return (
								<Genre
									onClick={() => handleGenresSelector(genre)}
									selected={selectedGenres.includes(genre)}
									key={genre}>
									{genre}
								</Genre>
							);
						})}
					</div>
				</div>
				<div className="w-56 self-end">
					<Submit value="Select" type="button" onClick={handleSubmit}></Submit>
				</div>
			</div>
		</ModalContainer>
	);
}

const Genre = ({ children, selected, onClick }) => {
	const getSelectedStyle = () => {
		return selected
			? "bg-light-subtle dark:bg-white dark:text-primary text-white"
			: "dark:text-white text-primary";
	};

	return (
		<button
			onClick={onClick}
			className={
				getSelectedStyle() +
				` border-2 dark:border-dark-subtle p-1 rounded mr-3
					border-light-subtle transition `
			}>
			{children}
		</button>
	);
};
