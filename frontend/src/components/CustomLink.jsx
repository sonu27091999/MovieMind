import React from "react";
import { Link } from "react-router-dom";

export default function CustomLink({ to, children }) {
	return (
		<Link
			className="dark:text-dark-subtle dark:hover:text-white transition
					text-light-subtle hover:text-primary"
			to={to}>
			{children}
		</Link>
	);
}
