import React from "react";

export default function Container({ children, classname }) {
	return (
		<div className={"max-w-screen-xl mx-auto " + classname}>{children}</div>
	);
}
