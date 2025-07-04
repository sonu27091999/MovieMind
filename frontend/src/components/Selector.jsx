import React from "react";

export default function Selector({ name, value, options, label, onChange }) {
	return (
		<select
			className="border-2 bg-white dark:bg-primary dark:border-dark-subtle border-light-subtle p-1 pr-10 dark:focus:border-light
			 focus:border-primary outline-none transition rounded bg-transparent dark:text-dark-subtle
			  text-light-subtle dark:focus:text-white focus:text-primary"
			id={name}
			name={name}
			value={value}
			onChange={onChange}>
			{options.map(({ title, value }) => (
				<option key={title} value={value}>
					{title}
				</option>
			))}
		</select>
	);
}
