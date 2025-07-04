import React from "react";

const commonPosterUI = `flex items-center justify-center border border-dashed rounded
aspect-video dark:border-dark-subtle border-light-subtle
cursor-pointer`;

export default function PosterSelector({
	name,
	selectedPoster,
	accept,
	className,
	label,
	onChange,
}) {
	return (
		<div>
			<input
				onChange={onChange}
				accept={accept}
				name={name}
				id={name}
				type="file"
				hidden></input>
			<label htmlFor={name}>
				{selectedPoster ? (
					<img
						src={selectedPoster}
						className={commonPosterUI + "object-cover " + className}
						alt="Poster"></img>
				) : (
					<PosterUI label={label} className={className}></PosterUI>
				)}
			</label>
		</div>
	);
}

const PosterUI = ({ className, label }) => {
	return (
		<div className={commonPosterUI + " " + className}>
			<span className="dark:text-dark-subtle text-light-subtle">{label}</span>
		</div>
	);
};
