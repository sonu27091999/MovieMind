import React from "react";
import ModalContainer from "./ModalContainer";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

export default function CastModal({
	casts = [],
	visible,
	onClose,
	onRemoveClick,
}) {
	return (
		<ModalContainer visible={visible} onClose={onClose} ignoreContainer={true}>
			<div className="space-y-2 dark:bg-primary bg-white rounded max-w-[45rem] max-h-[40rem] overflow-auto p-2 custom-scroll-bar">
				{casts.map(({ profile, roleAs, leadActor }) => {
					const { name, avatar, id } = profile;
					return (
						<div
							key={id}
							className="flex space-x-3 dark:bg-secondary bg-white drop-shadow-md rounded">
							<img
								className="w-16 h-16 rounded aspect-square object-cover"
								src={avatar}
								alt={name}></img>
							<div className="w-full flex flex-col justify-between">
								<div>
									<p className="font-semibold dark:text-white text-primary flex-grow">
										{name}
									</p>
									<p className="text-sm dark:text-dark-subtle text-light-subtle">
										{roleAs}
									</p>
								</div>
								{leadActor && (
									<AiOutlineCheck className="text-light-subtle dark:text-dark-subtle"></AiOutlineCheck>
								)}
							</div>

							<button
								type="button"
								onClick={() => onRemoveClick(id)}
								className="dark:text-white text-primary hover:opacity-80 transition p-2">
								<AiOutlineClose></AiOutlineClose>
							</button>
						</div>
					);
				})}
			</div>
		</ModalContainer>
	);
}
