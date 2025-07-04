import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useNotification } from "../../hooks";
import { uploadMovie, uploadTrailer } from "../../api/movie";
import MovieForm from "./MovieForm";
import ModalContainer from "../modals/ModalContainer";

export default function MovieUpload({ visible, onClose }) {
	const { updateNotification } = useNotification();
	const [isVideoSelected, setIsVideoSelected] = useState(false);
	const [isVideoUploaded, setIsVideoUploaded] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [videoInfo, setVideoInfo] = useState({});
	const [busy, setBusy] = useState(false);

	const resetState = () => {
		setIsVideoSelected(false);
		setIsVideoUploaded(false);
		setUploadProgress(0);
		setVideoInfo({});
	};

	const handleTrailerUpload = async (formData) => {
		const { public_id, url, error } = await uploadTrailer(
			formData,
			setUploadProgress
		);
		if (error) return updateNotification("error", error);
		setIsVideoUploaded(true);
		setVideoInfo({ url, public_id });
	};

	const onFileUpload = async (file) => {
		setIsVideoSelected(true);
		const formData = new FormData();
		formData.append("video", file);
		handleTrailerUpload(formData);
	};

	const onTypeError = (error) => {
		updateNotification("error", error);
	};

	const getUploadProgressMessage = () => {
		if (uploadProgress >= 100) return "Processing";
		return `Upload Progress ${uploadProgress}%`;
	};

	const handleSubmit = async (data) => {
		setBusy(true);
		if (!videoInfo.url || !videoInfo.public_id)
			return updateNotification("error", "Trailer is missing");
		data.append("trailer", JSON.stringify(videoInfo));
		const { error, movie } = await uploadMovie(data);
		setBusy(false);

		if (error) return updateNotification("error", error);
		updateNotification("success", "Movie Uploaded Successfully");
		resetState();
		onClose();
		// if (error) return updateNotification("error", error);
	};

	return (
		<ModalContainer visible={visible}>
			<div className="mb-5">
				<UploadProgress
					visible={!isVideoUploaded && isVideoSelected}
					message={getUploadProgressMessage()}
					width={uploadProgress}></UploadProgress>
			</div>
			{!isVideoSelected ? (
				<TrailerUploader
					visible={!isVideoSelected}
					onFileUpload={onFileUpload}
					onTypeError={onTypeError}></TrailerUploader>
			) : (
				<MovieForm
					busy={busy}
					btnTitle="Upload"
					onSubmit={!busy ? handleSubmit : null}></MovieForm>
			)}
		</ModalContainer>
	);
}

const TrailerUploader = ({ visible, onTypeError, onFileUpload }) => {
	if (!visible) return null;
	return (
		<div className="h-full flex items-center justify-center">
			<FileUploader
				onTypeError={onTypeError}
				handleChange={onFileUpload}
				types={["mp4", "avi"]}>
				<label
					className="w-48 h-48 border border-dashed dark:border-dark-subtle 
							border-light-subtle rounded-full flex items-center justify-center flex-col
							text-secondary dark:text-dark-subtle cursor-pointer ">
					<AiOutlineCloudUpload size={80}></AiOutlineCloudUpload>
					<p>Drop your files here!</p>
				</label>
			</FileUploader>
		</div>
	);
};

const UploadProgress = ({ visible, width, message }) => {
	if (!visible) return null;
	return (
		<div className="dark:bg-secondary bg-white drop-shadow-lg rounded p-3">
			<div className="relative h-3 dark:bg-dark-subtle bg-light-subtle overflow-hidden">
				<div
					style={{ width: width + "%" }}
					className="h-full absolute left-0 dark:bg-white
				bg-secondary"></div>
			</div>
			<p className="font-semibold dark:text-dark-subtle text-light-subtle animate-pulse mt-1">
				{message}
			</p>
		</div>
	);
};
