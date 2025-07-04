import React, { useState } from "react";
import ModalContainer from "./ModalContainer";
import ActorForm from "../form/ActorForm";
import { createActor } from "../../api/actor";
import { useNotification } from "../../hooks";

export default function ActorUpload({ visible, onClose }) {
	const [busy, setBusy] = useState(false);
	const { updateNotification } = useNotification();

	const handleSubmit = async (data) => {
		setBusy(true);
		const { actor, error } = await createActor(data);
		setBusy(false);
		if (error) return updateNotification("error", error);
		updateNotification("success", "Actor Created Successfully!");
		onClose();
	};

	return (
		<ModalContainer visible={visible} onClose={onClose} ignoreContainer>
			<ActorForm
				title="Create New Actor"
				btnTitle="Create"
				onSubmit={!busy ? handleSubmit : null}
				busy={busy}></ActorForm>
		</ModalContainer>
	);
}
