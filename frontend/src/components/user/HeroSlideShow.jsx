import React, { useEffect, useRef, useState, forwardRef } from "react";
import { getLatestUploads } from "../../api/movie";
import { useNotification } from "../../hooks";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
import { Link } from "react-router-dom";

let count = 0;
let intervalId;
let newTime = 0;
let lastTime = 0;
export default function HeroSlideShow() {
	const [slide, setSlide] = useState({});
	const [cloneSlide, setCloneSlide] = useState({});
	const [movies, setMovies] = useState([]);
	const [upNext, setUpNext] = useState([]);
	const [visible, setVisible] = useState(true);
	const slideRef = useRef();
	const cloneSlideRef = useRef();

	const { updateNotification } = useNotification();

	const fetchLatestUploads = async (signal) => {
		const { error, movies } = await getLatestUploads(signal);
		if (error) return updateNotification("error", error);

		setMovies([...movies]);
		setSlide(movies[0]);
	};

	const startSlideShow = () => {
		intervalId = setInterval(() => {
			newTime = Date.now();
			const delta = newTime - lastTime;
			if (delta < 4000) clearInterval(intervalId);
			handleOnNextClick();
		}, 3500);
		updateUpNext(count);
	};

	const pauseSlideShow = () => {
		clearInterval(intervalId);
	};

	const updateUpNext = (currentIndex) => {
		if (!movies.length) return;
		const upNextCount = currentIndex + 1;
		const end = upNextCount + 3;

		let newMovies = [...movies];
		newMovies.slice(upNextCount, end);
		if (!newMovies.length) {
			newMovies = [...movies].slice(0, 3);
		}
		setUpNext([...newMovies]);
	};

	const handleOnNextClick = () => {
		lastTime = Date.now();
		pauseSlideShow();
		setCloneSlide(movies[count]);
		count = (count + 1) % movies.length;
		setSlide(movies[count]);
		cloneSlideRef.current.classList.add("slide-out-to-left");
		slideRef.current.classList.add("slide-in-from-right");
		updateUpNext(count);
	};

	const handleOnPrevClick = () => {
		pauseSlideShow();
		setCloneSlide(movies[count]);
		count = (count - 1 + movies.length) % movies.length;
		setSlide(movies[count]);
		cloneSlideRef.current.classList.add("slide-out-to-right");
		slideRef.current.classList.add("slide-in-from-left");
		updateUpNext(count);
	};

	const handleAnimationEnd = () => {
		const classes = [
			"slide-out-to-left",
			"slide-in-from-right",
			"slide-out-to-right",
			"slide-in-from-left",
		];
		slideRef.current.classList.remove(...classes);
		cloneSlideRef.current.classList.remove(...classes);
		setCloneSlide({});
		startSlideShow();
	};

	const handleOnVisibilityChange = () => {
		const visibility = document.visibilityState;
		if (visibility === "hidden") setVisible(false);
		if (visibility === "visible") setVisible(true);
	};

	useEffect(() => {
		const ac = new AbortController();
		fetchLatestUploads(ac.signal);
		document.addEventListener("visibilitychange", handleOnVisibilityChange);

		return () => {
			ac.abort();
			pauseSlideShow();
			document.removeEventListener(
				"visibilitychange",
				handleOnVisibilityChange
			);
		};
	}, []);

	useEffect(() => {
		if (movies.length && visible) startSlideShow();
		else pauseSlideShow();
	}, [movies.length]);

	return (
		<div className="w-full flex">
			<div className="md:w-4/5 w-full aspect-video relative overflow-hidden">
				<Slide
					title={slide.title}
					src={slide.poster}
					ref={slideRef}
					id={slide.id}></Slide>
				{/* cloned slide */}
				<Slide
					ref={cloneSlideRef}
					title={cloneSlide.title}
					className="aspect-video object-cover absolute inset-0"
					src={cloneSlide?.poster}
					onAnimationEnd={handleAnimationEnd}
					id={slide.id}></Slide>

				<SlideShowController
					onNextClick={handleOnNextClick}
					onPrevClick={handleOnPrevClick}></SlideShowController>
			</div>
			<div className="w-1/5 md:block hidden space-y-3 px-3">
				<h1 className="font-semibold text-2xl dark:text-white text-primary">
					Up Next
				</h1>
				{upNext.map(({ poster, id }) => {
					return (
						<img
							src={poster}
							alt=""
							key={id}
							className="aspect-video object-cover rounded"></img>
					);
				})}
			</div>
		</div>
	);
}

const SlideShowController = ({ onPrevClick, onNextClick }) => {
	return (
		<div className="absolute top-1/2 -translate-y-1/2 w-full flex items-center justify-between px-2">
			<button
				onClick={onPrevClick}
				className="bg-primary rounded border-2 text-white text-xl p-2 outline-none"
				type="button">
				<AiOutlineDoubleLeft></AiOutlineDoubleLeft>
			</button>
			<button
				onClick={onNextClick}
				className="bg-primary rounded border-2 text-white text-xl p-2 outline-none"
				type="button">
				<AiOutlineDoubleRight></AiOutlineDoubleRight>
			</button>
		</div>
	);
};

const Slide = forwardRef((props, ref) => {
	const { id, title, src, classname = "", ...rest } = props;
	return (
		<Link
			to={"/movie/" + id}
			ref={ref}
			className={"w-full cursor-pointer block " + classname}
			{...rest}>
			{src ? (
				<img
					className="aspect-video object-cover"
					src={src}
					// onAnimationEnd={handleAnimationEnd}
					alt=""></img>
			) : null}
			{title ? (
				<div className="absolute inset-0 flex flex-col justify-end py-3 bg-gradient-to-t from-white via-transparent dark:from-primary dark:via-transparent">
					<h1 className="font-semibold text-4xl dark:text-highlight-dark text-highlight">
						{title}
					</h1>
				</div>
			) : null}
		</Link>
	);
});
