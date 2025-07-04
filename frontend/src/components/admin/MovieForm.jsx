import React, { useEffect, useState } from "react";
import TagsInput from "../TagsInput";
import { commonInputClasses } from "../../utils/theme";
import Submit from "../form/Submit";
import { useNotification } from "../../hooks";
import WritersModal from "../modals/WritersModal";
import CastForm from "../form/CastForm";
import CastModal from "../modals/CastModal";
import PosterSelector from "../PosterSelector";
import GenresSelector from "../GenresSelector";
import GenresModal from "../modals/GenresModal";
import Selector from "../Selector";
import {
	languageOptions,
	statusOptions,
	typeOptions,
} from "../../utils/options";
import Label from "../Label";
import DirectorSelector from "../DirectorSelector";
import WriterSelector from "../WriterSelector";
import ViewAllButton from "../ViewAllButton";
import LabelWithBadge from "../LabelWithBadge";
import { validateMovie } from "../../utils/validator";

const defaultMovieInfo = {
	title: "",
	storyLine: "",
	tags: [],
	cast: [],
	director: {},
	writers: [],
	releaseDate: "",
	poster: null,
	genres: [],
	type: "",
	language: "",
	status: "",
};

export default function MovieForm({ busy, btnTitle, onSubmit, initialState }) {
	const [movieInfo, setMovieInfo] = useState({ ...defaultMovieInfo });
	const [showWritersModal, setShowWritersModal] = useState(false);
	const [showCastModal, setShowCastModal] = useState(false);
	const [showGenresModal, setShowGenresModal] = useState(false);
	const [selectedPosterForUI, setSelectedPosterForUI] = useState("");

	const { updateNotification } = useNotification();

	const handleSubmit = (e) => {
		e.preventDefault();
		const { error } = validateMovie(movieInfo);
		if (error) return updateNotification("error", error);

		const formData = new FormData();
		const finalMovieInfo = { ...movieInfo };

		// cast, tags, genres, writers
		const { tags, genres, cast, writers, director, poster } = movieInfo;
		finalMovieInfo.tags = JSON.stringify(tags);
		finalMovieInfo.genres = JSON.stringify(genres);

		const finalCast = cast.map((c) => {
			return {
				actor: c.profile.id,
				roleAs: c.roleAs,
				leadActor: c.leadActor,
			};
		});
		finalMovieInfo.cast = JSON.stringify(finalCast);

		if (writers.length) {
			const finalWriters = writers.map((w) => w.id);
			finalMovieInfo.writers = JSON.stringify(finalWriters);
		}

		if (director.id) {
			finalMovieInfo.director = director.id;
		}

		if (poster) {
			finalMovieInfo.poster = poster;
		}

		for (let key in finalMovieInfo) {
			formData.append(key, finalMovieInfo[key]);
		}

		onSubmit(formData);
	};

	const updatePosterForUI = (file) => {
		const url = URL.createObjectURL(file);
		setSelectedPosterForUI(url);
	};

	const handleChange = ({ target }) => {
		const { value, name, files } = target;

		if (name === "poster") {
			const file = files[0];
			updatePosterForUI(file);
			setSelectedPosterForUI(URL.createObjectURL(file));
			return setMovieInfo({ ...movieInfo, poster: file });
		}

		setMovieInfo({ ...movieInfo, [name]: value });
	};

	const updateTags = (tags) => {
		console.log("Updating tags with", tags);
		setMovieInfo({ ...movieInfo, tags });
	};

	const updateDirector = (profile) => {
		setMovieInfo({ ...movieInfo, director: profile });
	};

	const updateCast = (newCast) => {
		const { cast } = movieInfo;
		setMovieInfo({ ...movieInfo, cast: [...cast, newCast] });
	};

	const updateGenres = (genres) => {
		setMovieInfo({ ...movieInfo, genres });
	};

	const updateWriters = (profile) => {
		const { writers } = movieInfo;
		for (let writer of writers) {
			if (writer.id === profile.id) {
				return updateNotification(
					"warning",
					"This profile is already selected"
				);
			}
		}

		setMovieInfo({ ...movieInfo, writers: [...writers, profile] });
	};

	const handleWritersRemove = (profileId) => {
		const { writers } = movieInfo;
		const newWriters = writers.filter(({ id }) => id !== profileId);
		if (newWriters.length === 0) setShowWritersModal(false);
		setMovieInfo({ ...movieInfo, writers: [...newWriters] });
	};

	const handleCastRemove = (profileId) => {
		const { cast } = movieInfo;
		const newCast = cast.filter(({ profile }) => profile.id !== profileId);
		if (newCast.length === 0) setShowCastModal(false);
		setMovieInfo({ ...movieInfo, cast: [...newCast] });
	};

	const hideGenresModal = () => {
		setShowGenresModal(false);
	};

	const displayGenresModal = () => {
		setShowGenresModal(true);
	};

	useEffect(() => {
		if (initialState) {
			setMovieInfo({
				...initialState,
				releaseDate: initialState.releaseDate.split("T")[0],
				poster: null,
			});
			setSelectedPosterForUI(initialState.poster);
		}
	}, [initialState]);

	const {
		title,
		storyLine,
		writers,
		cast,
		tags,
		genres,
		type,
		language,
		status,
		releaseDate,
	} = movieInfo;
	return (
		<>
			<div className="flex space-x-3">
				<div className="w-[70%] space-y-5">
					<Label htmlFor="title">Title</Label>
					<div>
						<input
							id="title"
							value={title}
							onChange={handleChange}
							name="title"
							type="text"
							className={
								commonInputClasses + "border-b-2 font-semibold  text-xl"
							}
							placeholder="Titanic"></input>
					</div>
					<div>
						<Label htmlFor="storyline">Story Line</Label>
						<textarea
							id="storyline"
							value={storyLine}
							onChange={handleChange}
							name="storyLine"
							className={commonInputClasses + "border-b-2 resize-none h-24"}
							placeholder="Movie story line..."></textarea>
					</div>
					<div>
						<Label htmlFor="tags">Tags</Label>
						<TagsInput
							value={tags}
							name="tags"
							onChange={updateTags}></TagsInput>
					</div>

					<DirectorSelector onSelect={updateDirector}></DirectorSelector>

					<div>
						<div className="flex justify-between">
							<LabelWithBadge badge={writers.length} htmlFor="writers">
								Writers
							</LabelWithBadge>
							<ViewAllButton
								visible={writers.length}
								onClick={() => setShowWritersModal(true)}>
								View All
							</ViewAllButton>
						</div>
						<WriterSelector onSelect={updateWriters}></WriterSelector>
					</div>
					<div>
						<div className="flex justify-between">
							<LabelWithBadge badge={cast.length} htmlFor="writers">
								Add Cast & Crew
							</LabelWithBadge>
							<ViewAllButton
								onClick={() => setShowCastModal(true)}
								visible={cast.length}>
								View All
							</ViewAllButton>
						</div>
						<CastForm onSubmit={updateCast}></CastForm>
					</div>
					<input
						type="date"
						onChange={handleChange}
						name="releaseDate"
						value={releaseDate}
						className={
							commonInputClasses + "border-2 rounded p-1 w-auto"
						}></input>
					<Submit
						busy={busy}
						value={btnTitle}
						onClick={handleSubmit}
						type="button"></Submit>
				</div>
				<div className="w-[30%] space-y-5">
					<PosterSelector
						name="poster"
						accept="image/jpg, image/jpeg, image/png"
						label="Select Poster"
						onChange={handleChange}
						selectedPoster={selectedPosterForUI}></PosterSelector>
					<GenresSelector
						badge={genres.length}
						onClick={displayGenresModal}></GenresSelector>
					<Selector
						onChange={handleChange}
						name="type"
						value={type}
						options={typeOptions}
						label="Type"></Selector>
					<Selector
						onChange={handleChange}
						name="language"
						value={language}
						options={languageOptions}
						label="Language"></Selector>
					<Selector
						onChange={handleChange}
						name="status"
						value={status}
						options={statusOptions}
						label="Status"></Selector>
				</div>
			</div>
			<WritersModal
				visible={showWritersModal}
				onRemoveClick={handleWritersRemove}
				profiles={writers}
				onClose={() => setShowWritersModal(false)}></WritersModal>

			<CastModal
				visible={showCastModal}
				casts={cast}
				onClose={() => setShowCastModal(false)}
				onRemoveClick={handleCastRemove}></CastModal>
			<GenresModal
				onSubmit={updateGenres}
				visible={showGenresModal}
				onClose={hideGenresModal}
				previousSelection={genres}></GenresModal>
		</>
	);
}
