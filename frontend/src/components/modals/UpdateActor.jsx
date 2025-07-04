import React, { useState } from "react";
import ModalContainer from "./ModalContainer";
import ActorForm from "../form/ActorForm";
import { useNotification } from "../../hooks";
import { updateActor } from "../../api/actor";

export default function UpdateActor({
	visible,
	onClose,
	initialState,
	onSuccess,
}) {
	const [busy, setBusy] = useState(false);
	const { updateNotification } = useNotification();

	const handleSubmit = async (data) => {
		setBusy(true);
		const { actor, error } = await updateActor(initialState.id, data);
		setBusy(false);
		if (error) return updateNotification("error", error);
		onSuccess(actor);
		updateNotification("success", "Actor Updated Successfully!");
		onClose();
	};

	return (
		<ModalContainer visible={visible} onClose={onClose} ignoreContainer>
			<ActorForm
				title="Update Actor"
				btnTitle="Update"
				onSubmit={!busy ? handleSubmit : null}
				initialState={initialState}
				busy={busy}></ActorForm>
		</ModalContainer>
	);
}
