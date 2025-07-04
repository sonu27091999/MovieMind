import React, { useEffect, useState } from "react";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { deleteActor, getActors, searchActor } from "../../api/actor";
import { useNotification, useSearch } from "../../hooks";
import NextAndPreviousButton from "../NextAndPreviousButton";
import UpdateActor from "../modals/UpdateActor";
import AppSearchForm from "../form/AppSearchForm";
import NotFoundText from "../NotFoundText";
import ConfirmModal from "../modals/ConfirmModal";

let currentPageNo = 0;
const limit = 20;
export default function Actors() {
	const [actors, setActors] = useState([]);
	const [results, setResults] = useState([]);
	const [reachedToEnd, setReachedToEnd] = useState(false);
	const [showUpdateModal, setShowUpdateModal] = useState(false);
	const [selectedProfile, setSelectedProfile] = useState(null);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [busy, setBusy] = useState(false);

	const { updateNotification } = useNotification();
	const { handleSearch, resetSearch, resultNotFound } = useSearch();

	const fetchActors = async (pageNo) => {
		const { profiles, error } = await getActors(pageNo, limit);
		if (error) return updateNotification("error", error);

		if (!profiles.length) {
			setReachedToEnd(true);
			currentPageNo = pageNo - 1;
			return;
		}

		setActors([...profiles]);
	};

	const handleOnNextClick = () => {
		if (reachedToEnd) return;
		currentPageNo += 1;
		fetchActors(currentPageNo);
	};

	const handleOnPrevClick = () => {
		if (currentPageNo <= 0) return;
		currentPageNo -= 1;
		fetchActors(currentPageNo);
	};

	const handleonEditClick = (profile) => {
		setShowUpdateModal(true);
		setSelectedProfile(profile);
	};

	const handleOnDeleteClick = (profile) => {
		setSelectedProfile(profile);
		setShowConfirmModal(true);
	};

	const handleOnDeleteConfirm = async () => {
		// setBusy(true);
		// const { error, message } = await deleteActor(selectedProfile.id);
		// setBusy(false);
		// if (error) return updateNotification("error", error);
		// updateNotification("success", message);
		// hideConfirmModal();
		// fetchActors(currentPageNo);
	};

	const hideUpdateModal = () => {
		setShowUpdateModal(false);
	};

	const handleOnSearchSubmit = (value) => {
		handleSearch(searchActor, value, setResults);
	};

	const handleOnActorUpdate = (profile) => {
		const updatedActors = actors.map((actor) => {
			if (profile.id === actor.id) {
				return profile;
			}
			return actor;
		});

		setActors([...updatedActors]);
	};

	const handleSearchFormReset = () => {
		resetSearch();
		setResults([]);
	};

	const hideConfirmModal = () => {
		setShowConfirmModal(false);
	};

	useEffect(() => {
		fetchActors(currentPageNo);
	}, []);

	return (
		<>
			<div className="p-5">
				<div className="flex justify-end mb-5">
					<AppSearchForm
						placeholder="Search Actors..."
						onSubmit={handleOnSearchSubmit}
						showResetButton={results.length || resultNotFound}
						onReset={handleSearchFormReset}></AppSearchForm>
				</div>
				<NotFoundText
					text="Record not found"
					visible={resultNotFound}></NotFoundText>
				<div className="grid grid-cols-4 gap-5">
					{results.length || resultNotFound
						? results.map((actor) => (
								<ActorProfile
									profile={actor}
									key={actor.id}
									onEditClick={() => handleonEditClick(actor)}
									onDeleteClick={() =>
										handleOnDeleteClick(actor)
									}></ActorProfile>
						  ))
						: actors.map((actor) => (
								<ActorProfile
									profile={actor}
									key={actor.id}
									onEditClick={() => handleonEditClick(actor)}
									onDeleteClick={() =>
										handleOnDeleteClick(actor)
									}></ActorProfile>
						  ))}
				</div>
				{!results.length && !resultNotFound ? (
					<NextAndPreviousButton
						classname="mt-5"
						onNextClick={handleOnNextClick}
						onPrevClick={handleOnPrevClick}></NextAndPreviousButton>
				) : null}
			</div>
			<ConfirmModal
				visible={showConfirmModal}
				title="Are you sure?"
				subtitle="This action will remove this profile permanently!"
				busy={busy}
				onConfirm={handleOnDeleteConfirm}
				onCancel={hideConfirmModal}></ConfirmModal>
			<UpdateActor
				visible={showUpdateModal}
				onClose={hideUpdateModal}
				initialState={selectedProfile}
				onSuccess={handleOnActorUpdate}></UpdateActor>
		</>
	);
}

const ActorProfile = ({ profile, onEditClick, onDeleteClick }) => {
	const [showOptions, setShowOptions] = useState(false);
	const [acceptedNameLength, setAcceptedNameLength] = useState(25);

	const handleOnMouseEnter = () => {
		setShowOptions(true);
	};

	const handleOnMouseLeave = () => {
		setShowOptions(false);
	};

	const getName = (name) => {
		if (name.length < acceptedNameLength) return name;
		return name.substring(0, acceptedNameLength) + "..";
	};

	if (!profile) return null;

	const { name, avatar, about = "" } = profile;

	return (
		<div className="bg-white shadow dark:bg-secondary h-20 overflow-hidden rounded">
			<div
				onMouseEnter={handleOnMouseEnter}
				onMouseLeave={handleOnMouseLeave}
				className="flex cursor-pointer relative">
				<img
					src={avatar}
					alt={name}
					className="w-20 aspect-square object-cover"></img>
				<div className="px-2">
					<h1 className="text-xl text-primary dark:text-white font-semibold whitespace-nowrap">
						{getName(name)}
					</h1>
					<p className="text-primary dark:text-white">
						{about.substring(0, 50)}
					</p>
				</div>
				<Options
					onEditClick={onEditClick}
					onDeleteClick={onDeleteClick}
					visible={showOptions}></Options>
			</div>
		</div>
	);
};

const Options = ({ visible, onDeleteClick, onEditClick }) => {
	if (!visible) return null;
	console.log("here");
	return (
		<div
			className="absolute inset-0 bg-primary bg-opacity-25 backdrop-blur-sm flex 
			justify-center items-center space-x-5">
			<button
				type="button"
				onClick={onDeleteClick}
				className="p-2 rounded-full bg-white text-primary hover:opacity-80 transition">
				<BsTrash></BsTrash>
			</button>
			<button
				type="button"
				onClick={onEditClick}
				className="p-2 rounded-full bg-white text-primary hover:opacity-80 transition">
				<BsPencilSquare></BsPencilSquare>
			</button>
		</div>
	);
};
