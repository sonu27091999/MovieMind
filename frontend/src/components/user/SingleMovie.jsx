import React, { useEffect, useState } from "react";
import { getSingleMovie } from "../../api/movie";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth, useNotification } from "../../hooks";
import Container from "../Container";
import RatingStar from "../RatingStar";
import RelatedMovies from "../RelatedMovies";
import AddRatingModal from "../modals/AddRatingModal";
import CustomButtonLink from "../CustomButtonLink";
import ProfileModal from "../modals/ProfileModal";

const convertDate = (date = "") => {
	return date.split("T")[0];
};

export default function SingleMovie() {
	const [movie, setMovie] = useState({});
	const [ready, setReady] = useState(false);
	const [showRatingModal, setShowRatingModal] = useState(false);
	const [showProfileModal, setShowProfileModal] = useState(false);
	const [selectedProfile, setSelectedProfile] = useState({});

	const { updateNotification } = useNotification();
	const { authInfo } = useAuth();
	const { movieId } = useParams();
	const navigate = useNavigate();

	const { isLoggedIn } = authInfo;

	const fetchMovie = async () => {
		const { error, movie } = await getSingleMovie(movieId);
		if (error) return updateNotification("error", error);
		setReady(true);
		setMovie(movie);
	};

	const handleOnRateMovie = () => {
		if (!isLoggedIn) return navigate("/auth/signin");
		setShowRatingModal(true);
	};

	const hideRatingModal = () => setShowRatingModal(false);
	const hideProfileModal = () => setShowProfileModal(false);

	const handleOnRatingSuccess = (reviews) => {
		setMovie({ ...movie, reviews: { ...reviews } });
	};

	const handleProfileClick = (profile) => {
		setSelectedProfile(profile);
		setShowProfileModal(true);
	};

	useEffect(() => {
		if (movieId) fetchMovie();
	}, [movieId]);

	if (!ready) {
		return (
			<div className="h-screen flex justify-center items-center dark:bg-primary bg-white min-h-screen">
				<p className="text-light-subtle dark:text-dark-subtle animate-pulse	">
					Please wait
				</p>
			</div>
		);
	}

	const {
		id,
		trailer,
		poster,
		title,
		storyLine,
		language,
		releaseDate,
		type,
		directors: director = {},
		reviews = {},
		writers = [],
		cast = [],
		genres = [],
	} = movie;
	console.log(movie);
	return (
		<div className="dark:bg-primary bg-white min-h-screen pb-10">
			<Container classname="xl:px-0 px-2">
				<video poster={poster} controls src={trailer}></video>
				<div className="flex justify-between">
					<h1 className="xl:text-4xl lg:text-3xl text-2xl text-highlight dark:text-highlight-dark font-semibold py-3">
						{title}
					</h1>
					<div className="flex flex-col items-end">
						<RatingStar rating={reviews.ratingAvg}></RatingStar>
						<CustomButtonLink
							label={reviews?.reviewCount || 0 + " Reviews"}
							onClick={() =>
								navigate("/movie/reviews/" + id)
							}></CustomButtonLink>

						<CustomButtonLink
							label="Rate The Movie"
							onClick={handleOnRateMovie}></CustomButtonLink>
					</div>
				</div>
				<div className="space-y-3">
					<p className="text-light-subtle dark:text-dark-subtle">{storyLine}</p>
					<ListWithLabel label="Director: ">
						<CustomButtonLink
							label={director.name}
							onClick={() => handleProfileClick(director)}></CustomButtonLink>
					</ListWithLabel>

					<ListWithLabel label="Writers: ">
						{writers.map((w) => {
							return (
								<CustomButtonLink label={w.name} key={w.id}></CustomButtonLink>
							);
						})}
					</ListWithLabel>

					<ListWithLabel label="Cast: ">
						{cast.map(({ id, profile, leadActor }) => {
							return leadActor ? (
								<CustomButtonLink
									label={profile.name}
									key={id}></CustomButtonLink>
							) : null;
						})}
					</ListWithLabel>

					<ListWithLabel label="Language: ">
						<CustomButtonLink
							label={language}
							clickable={false}></CustomButtonLink>
					</ListWithLabel>

					<ListWithLabel label="Release Date: ">
						<CustomButtonLink
							label={convertDate(releaseDate)}
							clickable={false}></CustomButtonLink>
					</ListWithLabel>

					<ListWithLabel label="Genres: ">
						{genres.map((g) => {
							<CustomButtonLink
								label={g}
								key={g}
								clickable={false}></CustomButtonLink>;
						})}
					</ListWithLabel>

					<ListWithLabel label="Type: ">
						<CustomButtonLink label={type} clickable={false}></CustomButtonLink>
					</ListWithLabel>

					<CastProfiles cast={cast}></CastProfiles>
					<RelatedMovies movieId={movieId}></RelatedMovies>
				</div>
			</Container>
			<AddRatingModal
				visible={showRatingModal}
				onClose={hideRatingModal}
				onSuccess={handleOnRatingSuccess}></AddRatingModal>
			<ProfileModal
				visible={showProfileModal}
				onClose={hideProfileModal}
				profileId={selectedProfile.id}></ProfileModal>
		</div>
	);
}

const ListWithLabel = ({ children, label }) => {
	return (
		<div className="flex space-x-2">
			<p className="text-light-subtle dark:text-dark-subtle font-semibold">
				{label}
			</p>
			{children}
		</div>
	);
};

const CastProfiles = ({ cast }) => {
	return (
		<div className="">
			<h1 className="text-light-subtle dark:text-dark-subtle font-semibold text-2xl mb-2">
				Cast:
			</h1>
			<div className="flex flex-wrap space-x-4">
				{cast.map((c) => {
					return (
						<div
							key={c.profile.id}
							className=" basis-28  flex flex-col items-center text-center mb-4">
							<img
								className="w-24 h-24 aspect-square object-cover rounded-full"
								src={c.profile.avatar}
								alt=""></img>
							<CustomButtonLink label={c.profile.name}></CustomButtonLink>

							<span className="text-light-subtle dark:text-dark-subtle text-sm">
								as
							</span>
							<p className="text-light-subtle dark:text-dark-subtle ">
								{c.roleAs}
							</p>
						</div>
					);
				})}
			</div>
		</div>
	);
};
