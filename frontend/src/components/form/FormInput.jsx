import React from "react";

export default function FormInput({ label, name, placeholder, ...rest }) {
	return (
		<div className="flex flex-col-reverse">
			<input
				id={name}
				name={name}
				className="bg-transparent rounded peer transition
									border-2 dark:border-dark-subtle border-light-subtle p-2
									dark:text-white
									w-full text-lg outline-none dark:focus:border-white
									focus:border-primary"
				placeholder={placeholder}
				{...rest}></input>
			<label
				className="font-semibold dark:text-dark-subtle dark:peer-focus:text-white
							transition self-start text-light-subtle peer-focus:text-primary"
				htmlFor={name}>
				{label}
			</label>
		</div>
	);
}
