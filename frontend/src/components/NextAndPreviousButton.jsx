import React from "react";

export default function NextAndPreviousButton({
	classname = "",
	onNextClick,
	onPrevClick,
}) {
	const getClasses = () => {
		return "flex justify-end items-center space-x-3 ";
	};
	return (
		<div className={getClasses() + classname}>
			<button
				type="button"
				className="text-primary dark:text-white hover:underline transition"
				onClick={onPrevClick}>
				Prev
			</button>
			<button
				type="button"
				className="text-primary dark:text-white hover:underline transition"
				onClick={onNextClick}>
				Next
			</button>
		</div>
	);
}
