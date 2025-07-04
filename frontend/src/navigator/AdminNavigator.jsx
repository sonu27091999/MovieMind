import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../components/admin/Dashboard";
import Movies from "../components/admin/Movies";
import Actors from "../components/admin/Actors";
import NavBar from "../components/admin/NavBar";
import Header from "../components/admin/Header";
import MovieUpload from "../components/admin/MovieUpload";
import ActorUpload from "../components/modals/ActorUpload";
import NotFound from "../components/NotFound";
import SearchMovies from "../components/admin/SearchMovies";

export default function AdminNavigator() {
	const [showMovieUploadModal, setShowMovieUploadModal] = useState(false);
	const [showActorUploadModal, setShowActorUploadModal] = useState(false);

	const hideMovieUploadModal = () => {
		setShowMovieUploadModal(false);
	};
	const displayMovieUploadModal = () => {
		setShowMovieUploadModal(true);
	};

	const hideActorUploadModal = () => {
		setShowActorUploadModal(false);
	};
	const displayActorUploadModal = () => {
		setShowActorUploadModal(true);
	};

	return (
		<>
			<div className="flex dark:bg-primary bg-white">
				<NavBar></NavBar>
				<div className="flex-1 max-w-screen-xl">
					<Header
						onAddMovieClick={displayMovieUploadModal}
						onAddActorClick={displayActorUploadModal}></Header>
					<Routes>
						<Route path="/" element={<Dashboard></Dashboard>}></Route>
						<Route path="/movies" element={<Movies></Movies>}></Route>
						<Route path="/actors" element={<Actors></Actors>}></Route>
						<Route
							path="/search"
							element={<SearchMovies></SearchMovies>}></Route>
						<Route path="*" element={<NotFound></NotFound>}></Route>
					</Routes>
				</div>
			</div>
			<MovieUpload
				visible={showMovieUploadModal}
				onClose={hideMovieUploadModal}></MovieUpload>
			<ActorUpload
				visible={showActorUploadModal}
				onClose={hideActorUploadModal}></ActorUpload>
		</>
	);
}
