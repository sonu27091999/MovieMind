import React, { forwardRef, useEffect, useRef, useState } from "react";
import { commonInputClasses } from "../utils/theme";

export default function LiveSearch({
	name,
	value = "",
	placeholder = "",
	results = [],
	selectedResultStyle,
	resultContainerStyle,
	inputStyle,
	renderItem = null,
	onChange = null,
	onSelect = null,
}) {
	const [displaySearch, setDisplaySearch] = useState(false);
	const [focusedIndex, setFocusedIndex] = useState(-1);
	const [defaultValue, setDefaultValue] = useState("");

	const handleOnFocus = () => {
		if (results.length) setDisplaySearch(true);
	};

	const handleOnBlur = () => {
		setTimeout(() => {
			setDisplaySearch(false);
			setFocusedIndex(-1);
		}, 100);
	};

	const handleSelection = (selectedItem) => {
		if (selectedItem) {
			onSelect(selectedItem);
			setDisplaySearch(false);
		}
	};

	const handleKeyDown = ({ key }) => {
		const keys = ["ArrowUp", "ArrowDown", "Enter", "Escape"];
		let nextCount;

		if (!keys.includes(key)) return;
		if (key === "ArrowDown") {
			nextCount = (focusedIndex + 1) % results.length;
		} else if (key === "ArrowUp") {
			nextCount = (focusedIndex - 1 + results.length) % results.length;
		} else if (key === "Enter") {
			return handleSelection(results[focusedIndex]);
		} else if (key === "Escape") {
			setDisplaySearch(false);
			setFocusedIndex(-1);
			return;
		}
		setFocusedIndex(nextCount);
	};

	const getInputStyle = () => {
		return inputStyle
			? inputStyle
			: commonInputClasses + "rounded border-2 p-1 text-lg";
	};

	const handleChange = (e) => {
		setDefaultValue(e.target.value);
		onChange && onChange(e);
	};

	useEffect(() => {
		setDefaultValue(value);
	}, [value]);

	useEffect(() => {
		if (results.length) return setDisplaySearch(true);
		setDisplaySearch(false);
	}, [results.length]);

	return (
		<div className="relative">
			<input
				id={name}
				name={name}
				type="text"
				placeholder={placeholder}
				onFocus={handleOnFocus}
				onBlur={handleOnBlur}
				onKeyDown={handleKeyDown}
				value={defaultValue}
				onChange={handleChange}
				className={getInputStyle()}></input>
			<SearchResults
				visible={displaySearch}
				results={results}
				focusedIndex={focusedIndex}
				onSelect={handleSelection}
				renderItem={renderItem}
				resultContainerStyle={resultContainerStyle}
				selectedResultStyle={selectedResultStyle}></SearchResults>
		</div>
	);
}

const SearchResults = ({
	visible,
	results = [],
	focusedIndex,
	onSelect,
	renderItem,
	resultContainerStyle,
	selectedResultStyle,
}) => {
	const resultsContainer = useRef();
	useEffect(() => {
		if (resultsContainer.current === undefined) return;
		console.log(resultsContainer.current);
		resultsContainer.current.scrollIntoView({
			behavior: "smooth",
			block: "center",
		});
	}, [focusedIndex]);

	if (!visible) return null;
	return (
		<div
			className="absolute right-0 left-0 top-10 bg-white 
				dark:bg-secondary shadow-md p-2 max-h-64 overflow-auto
				space-y-2 mt-1 custom-scroll-bar z-50">
			{results.map((result, index) => {
				const getSelectedClass = () => {
					return selectedResultStyle
						? selectedResultStyle
						: "dark:bg-dark-suble bg-light-subtle";
				};

				return (
					<ResultCard
						ref={index === focusedIndex ? resultsContainer : null}
						key={index.toString()}
						item={result}
						renderItem={renderItem}
						resultContainerStyle={resultContainerStyle}
						selectedResultStyle={
							index === focusedIndex ? getSelectedClass() : ""
						}
						onMouseDown={() => onSelect(result)}></ResultCard>
				);
			})}
		</div>
	);
};

const ResultCard = forwardRef((props, ref) => {
	const {
		item,
		renderItem,
		resultContainerStyle,
		selectedResultStyle,
		onMouseDown,
	} = props;

	const getClasses = () => {
		if (resultContainerStyle)
			return resultContainerStyle + " " + selectedResultStyle;

		return (
			selectedResultStyle +
			` cursor-pointer rounded overflow-hidden dark:hover:bg-dark-subtle
				hover:bg-light-subtle transition`
		);
	};

	return (
		<div onMouseDown={onMouseDown} ref={ref} className={getClasses()}>
			{renderItem(item)}
		</div>
	);
});
