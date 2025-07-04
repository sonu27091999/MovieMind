import React, { useEffect, useState } from "react";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import Submit from "./Submit";

const createArray = (count) => {
	new Array(count).fill("");
};

const ratings = createArray(10);
export default function RatingForm({ busy, initialState, onSubmit }) {
	const [selectedRating, setSelectedRating] = useState([1, 2, 3]);
	const [content, setContent] = useState("");

	const handleMouseEnter = (index) => {
		const ratings = createArray(index + 1);
		setSelectedRating([...ratings]);
	};

	const handleOnChange = ({ target }) => {
		setContent(target.value);
	};

	const handleSubmit = () => {
		if (!selectedRating.length) return;
		const data = {
			rating: selectedRating.length,
			content,
		};

		onSubmit(data);
	};

	useEffect(() => {
		if (initialState) {
			setContent(initialState.content);
			setSelectedRating(createArray(initialState.rating));
		}
	}, [initialState]);

	return (
		<div>
			<div className="p-5 dark:bg-primary bg-white rounded space-y-3">
				<div className="text-highlight dark:text-highlight-dark flex items-center relative">
					<StarsOutline
						ratings={ratings}
						handleMouseEnter={handleMouseEnter}></StarsOutline>
					<div className="flex items-center absolute top-1/2 -translate-y-1/2">
						<StarsFilled
							ratings={selectedRating}
							handleMouseEnter={handleMouseEnter}></StarsFilled>
					</div>
				</div>

				<textarea
					value={content}
					onChange={handleOnChange}
					className=" h-24 w-full border-2 p-2 dark:text-white text-primary rounded outline-none bg-transparent resize-none">
					asa
				</textarea>

				<Submit
					busy={busy}
					onClick={handleSubmit}
					value="Rate This Movie"></Submit>
			</div>
		</div>
	);
}

const StarsOutline = ({ ratings, handleMouseEnter }) => {
	return ratings.map((_, index) => {
		return (
			<AiOutlineStar
				className="cursor-pointer"
				onMouseEnter={() => handleMouseEnter(index)}
				key={index}
				size={24}></AiOutlineStar>
		);
	});
};

const StarsFilled = ({ ratings, handleMouseEnter }) => {
	return ratings.map((_, index) => {
		return (
			<AiFillStar
				className="cursor-pointer"
				onMouseEnter={() => handleMouseEnter(index)}
				key={index}
				size={24}></AiFillStar>
		);
	});
};
