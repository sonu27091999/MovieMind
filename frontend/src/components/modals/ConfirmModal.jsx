import React from "react";
import ModalContainer from "./ModalContainer";
import { ImSpinner3 } from "react-icons/im";

export default function ConfirmModal({
	visible,
	busy,
	onConfirm,
	onCancel,
	title,
	subtitle,
}) {
	const commonClass = "px-3 py-1 text-white rounded";

	return (
		<ModalContainer visible={visible} ignoreContainer>
			<div className="dark:bg-primary bg-white rounded p-3">
				<h1 className="text-red-400 text-lg font-semibold">{title}</h1>
				<p className="text-secondary dark:text-white text-sm">{subtitle}</p>
				<div className="flex items-center space-x-3 mt-3">
					{busy ? (
						<p className="flex items-center space-x-2 text-primary dark:text-white">
							<ImSpinner3 className="animate-spin"></ImSpinner3>
							<span>Please wait</span>
						</p>
					) : (
						<>
							<button
								onClick={onConfirm}
								type="button"
								className={commonClass + " bg-red-400"}>
								Confirm
							</button>
							<button
								onClick={onCancel}
								type="button"
								className={commonClass + " bg-blue-400"}>
								Cancel
							</button>
						</>
					)}
				</div>
			</div>
		</ModalContainer>
	);
}
