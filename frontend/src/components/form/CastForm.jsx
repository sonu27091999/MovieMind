import { useState } from "react";
import LiveSearch from "../LiveSearch";
import { commonInputClasses } from "../../utils/theme";
import { useNotification, useSearch } from "../../hooks";
import { renderItem } from "../../utils/helper";
import { searchActor } from "../../api/actor";

const defaultCastInfo = {
	profile: {},
	roleAs: "",
	leadActor: false,
};

export default function CastForm({ onSubmit }) {
	const [castInfo, setCastInfo] = useState({ ...defaultCastInfo });
	const [profiles, setProfiles] = useState([]);

	const { updateNotification } = useNotification();
	const { handleSearch, resetSearch } = useSearch();

	const { leadActor, profile, roleAs } = castInfo;

	const handleChange = ({ target }) => {
		const { checked, name, value } = target;
		if (name === "leadActor")
			return setCastInfo({ ...castInfo, leadActor: checked });
		setCastInfo({ ...castInfo, [name]: value });
	};

	const handleProfileSelect = (profile) => {
		setCastInfo({ ...castInfo, profile });
	};

	const handleProfileChange = ({ target }) => {
		const { value } = target;
		const { profile } = castInfo;

		profile.name = value;
		setCastInfo({ ...castInfo, ...profile });
		handleSearch(searchActor, value, setProfiles);
	};

	const handleSubmit = () => {
		const { profile, roleAs } = castInfo;
		if (!profile.name)
			return updateNotification("error", "Cast profile is missing");
		if (!roleAs.trim())
			return updateNotification("error", "Cast role is missing");
		console.log(castInfo);
		onSubmit(castInfo);
		setCastInfo({ ...defaultCastInfo, profile: { name: "" } });
		resetSearch();
		setProfiles([]);
	};

	return (
		<div className="flex items-center space-x-2">
			<input
				type="checkbox"
				name="leadActor"
				title="Set as Lead Actor"
				className="w-4 h-4"
				onChange={handleChange}
				checked={leadActor}></input>
			<LiveSearch
				placeholder="Search Profile..."
				results={profiles}
				onSelect={handleProfileSelect}
				renderItem={renderItem}
				value={profile.name}
				onChange={handleProfileChange}></LiveSearch>
			<span className="dark:text-dark-subtle text-light-subtle font-semibold">
				as
			</span>
			<div className="flex-grow">
				<input
					type="text"
					placeholder="Role as"
					value={roleAs}
					name="roleAs"
					onChange={handleChange}
					className={
						commonInputClasses + " rounded p-1 text-lg border-2"
					}></input>
			</div>
			<button
				type="button"
				onClick={handleSubmit}
				className="bg-secondary dark:bg-white dark:text-primary text-white px-1 rounded">
				Add
			</button>
		</div>
	);
}
