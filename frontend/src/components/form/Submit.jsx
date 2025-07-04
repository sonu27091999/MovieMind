import React from "react";
import { ImSpinner3 } from "react-icons/im";

export default function Submit({ value, busy, type, onClick }) {
	return (
		<button
			type={type || "submit"}
			onClick={onClick}
			className="w-full rounded dark:bg-white bg-secondary hover:bg-opacity-90
					transition font-semibold text-lg dark:text-secondary text-white
					cursor-pointer h-10 flex justify-center items-center">
			{busy ? <ImSpinner3 className="animate-spin"></ImSpinner3> : value}
		</button>
	);
}
