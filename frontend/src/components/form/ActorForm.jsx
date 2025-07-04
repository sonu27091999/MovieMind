import React, { useEffect, useState } from "react";
import { commonInputClasses } from "../../utils/theme";
import PosterSelector from "../PosterSelector";
import Selector from "../Selector";
import { useNotification } from "../../hooks";
import { ImSpinner3 } from "react-icons/im";

const defaultActorInfo = {
	name: "",
	about: "",
	avatar: null,
	gender: "",
};

const genderOptions = [
	{
		title: "Male",
		value: "male",
	},
	{
		title: "Female",
		value: "female",
	},
	{
		title: "Other",
		value: "other",
	},
];

const validateActor = ({ avatar, name, about, gender }) => {
	if (!name.trim()) return { error: "Actor name is missing!" };
	if (!about.trim()) return { error: "About section is missing!" };
	if (!gender.trim()) return { error: "Actor gender is missing!" };

	if (avatar && !avatar.type?.startsWith("image"))
		return { error: "Invalid Image file!" };

	return { error: null };
};

export default function ActorForm({
	title,
	btnTitle,
	onSubmit,
	busy,
	initialState,
}) {
	const [actorInfo, setActorInfo] = useState({ ...defaultActorInfo });
	const [selectedAvatarforUI, setSelectedAvatarforUI] = useState("");
	const { updateNotification } = useNotification();

	const updatePosterForUI = (file) => {
		const url = URL.createObjectURL(file);
		setSelectedAvatarforUI(url);
	};

	const handleChange = ({ target }) => {
		const { value, files, name } = target;
		if (name === "avatar") {
			const file = files[0];
			updatePosterForUI(file);
			return setActorInfo({ ...actorInfo, avatar: file });
		}
		setActorInfo({ ...actorInfo, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const { error } = validateActor(actorInfo);
		if (error) {
			return updateNotification("error", error);
		}
		const formData = new FormData();
		for (let key in actorInfo) {
			if (key) formData.append(key, actorInfo[key]);
		}
		// Submit form
		onSubmit(formData);
	};

	useEffect(() => {
		if (initialState) {
			setActorInfo({ ...initialState, avatar: null });
			setSelectedAvatarforUI(initialState.avatar);
		}
	}, [initialState]);

	const { name, about, gender } = actorInfo;

	return (
		<form
			className=" dark:bg-primary bg-white p-3 w-[35rem] rounded"
			onSubmit={handleSubmit}>
			<div className="flex justify-between items-center mb-3">
				<h1 className="font-semibold text-xl dark:text-white text-primary">
					{title}
				</h1>
				<button
					type="submit"
					className="h-8 w-24 dark:bg-white bg-primary text-white dark:text-primary
					hover:opacity-80 transition rounded flex items-center justify-center">
					{busy ? <ImSpinner3 className="animate-spin"></ImSpinner3> : btnTitle}
				</button>
			</div>
			<div className="flex space-x-2">
				<PosterSelector
					selectedPoster={selectedAvatarforUI}
					className="w-36 h-36 aspect-square object-cover"
					name="avatar"
					label="Select Avatar"
					accept="image/jpg, image/jpeg, image/png"
					onChange={handleChange}></PosterSelector>

				<div className="flex-grow flex flex-col space-y-2">
					<input
						type="text"
						placeholder="Enter Name"
						name="name"
						value={name}
						onChange={handleChange}
						className={commonInputClasses + " border-b-2"}></input>
					<textarea
						placeholder="About"
						name="about"
						value={about}
						onChange={handleChange}
						className={
							commonInputClasses + " border-b-2 resize-none h-full"
						}></textarea>
				</div>
			</div>
			<div className="mt-3">
				<Selector
					options={genderOptions}
					label="Gender"
					value={gender}
					onChange={handleChange}
					name="gender"></Selector>
			</div>
		</form>
	);
}
