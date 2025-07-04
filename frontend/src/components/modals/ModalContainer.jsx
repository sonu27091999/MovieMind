import React from "react";

export default function ModalContainer({
	visible,
	children,
	onClose,
	ignoreContainer = false,
}) {
	const handleClick = ({ target }) => {
		if (target.id === "modal-container") onClose && onClose();
	};

	const renderChildren = () => {
		if (ignoreContainer) return children;
		return (
			<div className="dark:bg-primary bg-white rounded w-[45rem] h-[40rem] overflow-auto p-2 custom-scroll-bar">
				{children}
			</div>
		);
	};

	if (!visible) return null;
	return (
		<div
			id="modal-container"
			onClick={handleClick}
			className="fixed inset-0 dark:bg-white dark:bg-opacity-40 bg-primary bg-opacity-40 backdrop-blur-sm
	flex items-center justify-center">
			{renderChildren()}
		</div>
	);
}
