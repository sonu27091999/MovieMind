const { isValidObjectId } = require("mongoose");
const cloudinary = require("../cloud");
const Movie = require("../models/movie");
const {
	sendError,
	formatActor,
	averageRatingPipeline,
	relatedMovieAggregation,
	getAverageRatings,
	topRatedMoviesPipeline,
} = require("../utils/helper");
const Review = require("../models/review");

const uploadTrailer = async (req, res) => {
	const { file } = req;
	if (!file) return sendError(res, "File not found!!!");

	const { secure_url: url, public_id } = await cloudinary.uploader.upload(
		file.path,
		{
			resource_type: "video",
		}
	);

	res.json({ url, public_id });
};

const createMovie = async (req, res) => {
	const { file } = req;
	const {
		title,
		storyLine,
		director,
		releaseDate,
		status,
		genres,
		type,
		tags,
		cast,
		writers,
		trailer,
		language,
	} = req.body;
	const movie = new Movie({
		title,
		storyLine,
		releaseDate,
		status,
		genres,
		type,
		tags,
		cast,
		trailer,
		language,
	});

	if (director) {
		if (!isValidObjectId(director))
			return sendError(res, "Director id is invalid!!!");
		movie.director = director;
	}

	if (writers) {
		console.log(typeof writers);
		writers.forEach((writer) => {
			if (!isValidObjectId(writer))
				return sendError(res, "Writer id is invalid!!!");
		});
		movie.writers = writers;
	}

	const {
		secure_url: url,
		public_id,
		responsive_breakpoints,
	} = await cloudinary.uploader.upload(file.path, {
		transformation: {
			width: 1280,
			height: 720,
		},
		responsive_breakpoints: {
			create_derived: true,
			max_width: 640,
			max_images: 3,
		},
	});
	movie.poster = {
		url,
		public_id,
		responsive: [],
	};
	responsive_breakpoints[0].breakpoints.forEach((img) => {
		const { secure_url } = img;
		movie.poster.responsive.push(secure_url);
	});
	await movie.save();
	res.json({
		movie: {
			id: movie._id,
			title,
		},
	});
};

const updateMovieWithoutPoster = async (req, res) => {
	const movieId = req.params.movieId;

	if (!isValidObjectId(movieId)) return sendError(res, "Invalid Movie ID!!!");

	const movie = await Movie.findById(movieId);
	if (!movie) return sendError(res, "Movie not found!!!");

	const {
		title,
		storyLine,
		director,
		releaseDate,
		status,
		genres,
		type,
		tags,
		cast,
		writers,
		trailer,
		language,
	} = req.body;

	movie.title = title;
	movie.storyLine = storyLine;
	movie.releaseDate = releaseDate;
	movie.status = status;
	movie.genres = genres;
	movie.type = type;
	movie.tags = tags;
	movie.cast = cast;
	movie.trailer = trailer;
	movie.language = language;

	if (director) {
		if (!isValidObjectId(director))
			return sendError(res, "Director id is invalid!!!");
		movie.director = director;
	}

	if (writers) {
		console.log(typeof writers);
		writers.forEach((writer) => {
			if (!isValidObjectId(writer))
				return sendError(res, "Writer id is invalid!!!");
		});
		movie.writers = writers;
	}

	await movie.save();
	res.json({ message: "Movie Updated Successfully!", movie });
};

const updateMovie = async (req, res) => {
	const movieId = req.params.movieId;
	const { file } = req;
	// if (!file) return sendError(res, "Poster not found!!!");

	if (!isValidObjectId(movieId)) return sendError(res, "Invalid Movie ID!!!");

	const movie = await Movie.findById(movieId);
	if (!movie) return sendError(res, "Movie not found!!!");

	const {
		title,
		storyLine,
		director,
		releaseDate,
		status,
		genres,
		type,
		tags,
		cast,
		writers,
		trailer,
		language,
	} = req.body;

	movie.title = title;
	movie.storyLine = storyLine;
	movie.releaseDate = releaseDate;
	movie.status = status;
	movie.genres = genres;
	movie.type = type;
	movie.tags = tags;
	movie.cast = cast;
	movie.language = language;

	if (director) {
		if (!isValidObjectId(director))
			return sendError(res, "Director id is invalid!!!");
		movie.director = director;
	}

	if (writers) {
		console.log(typeof writers);
		writers.forEach((writer) => {
			if (!isValidObjectId(writer))
				return sendError(res, "Writer id is invalid!!!");
		});
		movie.writers = writers;
	}

	if (file) {
		// Delete existing Poster - which will always exist ?
		const existingPosterId = movie.poster?.public_id;
		if (existingPosterId) {
			const { result } = await cloudinary.uploader.destroy(existingPosterId);
			if (result !== "ok")
				return sendError(res, "Unable to delete the file from cloud!");
		}

		// Upload new poster
		const {
			secure_url: url,
			public_id,
			responsive_breakpoints,
		} = await cloudinary.uploader.upload(file.path, {
			transformation: {
				width: 1280,
				height: 720,
			},
			responsive_breakpoints: {
				create_derived: true,
				max_width: 640,
				max_images: 3,
			},
		});
		movie.poster = {
			url,
			public_id,
			responsive: [],
		};
		responsive_breakpoints[0].breakpoints.forEach((img) => {
			const { secure_url } = img;
			movie.poster.responsive.push(secure_url);
		});
	}

	await movie.save();
	res.json({
		message: "Movie Updated Successfully!",
		movie: {
			id: movie._id,
			poster: movie.poster?.url,
			genres: movie.genres,
			status: movie.status,
			title: movie.title,
		},
	});
};

const deleteMovie = async (req, res) => {
	const movieId = req.params.movieId;

	if (!isValidObjectId(movieId)) return sendError(res, "Invalid Movie ID!!!");

	const movie = await Movie.findById(movieId);
	if (!movie) return sendError(res, "Movie not found!!!");

	// Delete poster
	const existingPosterId = movie.poster?.public_id;
	if (existingPosterId) {
		const { result } = await cloudinary.uploader.destroy(existingPosterId);
		if (result !== "ok")
			return sendError(res, "Unable to delete the poster from cloud!");
	}

	// Delete Trailer
	const existingTrailerId = movie.trailer?.public_id;
	if (!existingTrailerId)
		return sendError(res, "Something went wrong. Trailer not found!!!");
	const { result } = await cloudinary.uploader.destroy(existingTrailerId, {
		resource_type: "video",
	});
	if (result !== "ok")
		return sendError(res, "Unable to delete the trailer from cloud!");

	await Movie.findByIdAndDelete(movieId);
	res.json({ message: "Movie Deleted Successfully" });
};

const getMovies = async (req, res) => {
	const { pageNo = 0, limit = 10 } = req.query;
	const movies = await Movie.find({})
		.sort({ createdAt: -1 })
		.skip(parseInt(pageNo) * parseInt(limit))
		.limit(parseInt(limit));

	const results = movies.map((movie) => {
		return {
			id: movie._id,
			title: movie.title,
			poster: movie.poster?.url,
			responsivePosters: movie.poster?.responsive,
			genres: movie.genres,
			status: movie.status,
		};
	});

	res.json({ movies: results });
};

const getMovieForUpdate = async (req, res) => {
	const { movieId } = req.params;

	if (!isValidObjectId(movieId)) return sendError(res, "Id is invalid");

	const movie = await Movie.findById(movieId).populate(
		"director writers cast.actor"
	);
	res.json({
		movie: {
			id: movie._id,
			title: movie.title,
			storyLine: movie.storyLine,
			poster: movie.poster?.url,
			releaseDate: movie.releaseDate,
			status: movie.status,
			type: movie.type,
			language: movie.language,
			genres: movie.genres,
			tags: movie.tags,
			director: formatActor(movie.director),
			writers: movie.writers.map((w) => formatActor(w)),
			cast: movie.cast.map((c) => {
				return {
					id: c.id,
					profile: formatActor(c.actor),
					roleAs: c.roleAs,
					leadActor: c.leadActor,
				};
			}),
		},
	});
};

const searchMovies = async (req, res) => {
	const { title } = req.query;
	console.log("title: ", title);

	if (!title.trim()) return sendError(res, "Invalid Request");

	const movies = await Movie.find({
		title: { $regex: title, $options: "i" },
	});

	res.json({
		results: movies.map((m) => {
			return {
				id: m._id,
				title: m.title,
				poster: m.poster?.url,
				genres: m.genres,
				status: m.status,
			};
		}),
	});
};

const searchPublicMovies = async (req, res) => {
	const { title } = req.query;
	console.log("title: ", title);

	if (!title.trim()) return sendError(res, "Invalid Request");

	const movies = await Movie.find({
		title: { $regex: title, $options: "i" },
		status: "public",
	});

	const mapMovies = async (m) => {
		const reviews = await getAverageRatings(m._id);
		return {
			id: m._id,
			title: m.title,
			poster: m.poster?.url,
			responsivePosters: m.poster?.responsive,
			reviews: { ...reviews },
		};
	};

	const results = await Promise.all(movies.map(mapMovies));
	res.json({ results });

	res.json({
		results: movies.map((m) => {
			return {
				id: m._id,
				title: m.title,
				poster: m.poster?.url,
				genres: m.genres,
				status: m.status,
			};
		}),
	});
};

const getLatestUploads = async (req, res) => {
	const { limit = 5 } = req.query;

	const results = await Movie.find({ status: "public" })
		.sort("-createdAt")
		.limit(parseInt(limit));

	const movies = results.map((m) => {
		return {
			id: m._id,
			title: m.title,
			poster: m.poster?.url,
			responsivePosters: m.poster.responsive,
			trailer: m.trailer?.url,
			storyLine: m.storyLine,
		};
	});
	res.json({ movies });
};

const getSingleMovie = async (req, res) => {
	const { movieId } = req.params;

	if (!isValidObjectId(movieId))
		return sendError(res, "Movie Id is not valid!");

	const movie = await Movie.findById(movieId).populate(
		"director writers cast.actor"
	);

	// const [aggregatedResponse] = await Review.aggregate(
	// 	averageRatingPipeline(movie._id)
	// );

	// const reviews = {};
	// if (aggregatedResponse) {
	// 	const { ratingAvg, reviewCount } = aggregatedResponse;
	// 	reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1);
	// 	reviews.reviewCount = reviewCount;
	// }

	const reviews = await getAverageRatings(movie._id);

	const {
		_id: id,
		title,
		storyLine,
		cast,
		writers,
		director,
		releaseDate,
		genres,
		tags,
		language,
		poster,
		trailer,
		type,
	} = movie;

	res.json({
		movie: {
			id,
			title,
			storyLine,
			cast: cast.map((c) => ({
				id: c._id,
				profile: {
					name: c.actor.name,
					id: c.actor._id,
					avatar: c.actor?.avatar?.url,
				},
				leadActor: c.leadActor,
				roleAs: c.roleAs,
			})),
			writers: writers.map((w) => ({
				id: w._id,
				name: w.name,
			})),
			directors: {
				id: director._id,
				name: director.name,
			},
			releaseDate,
			genres,
			tags,
			language,
			poster: poster?.url,
			trailer: trailer?.url,
			type,
			reviews: { ...reviews },
		},
	});
};

const getRelatedMovies = async (req, res) => {
	const { movieId } = req.params;

	if (!isValidObjectId(movieId))
		return sendError(res, "Movie Id is not valid!");

	const movie = await Movie.findById(movieId);

	const movies = await Movie.aggregate(
		relatedMovieAggregation(movie.tags, movie._id)
	);

	const mapMovies = async (m) => {
		const reviews = await getAverageRatings(m._id);
		return {
			id: m._id,
			title: m.title,
			poster: m.poster,
			responsivePosters: m.responsivePosters,
			reviews: { ...reviews },
		};
	};

	const relatedMovies = Promise.all(movies.map(mapMovies));

	res.json({ movies: relatedMovies });
};

const getTopRatedMovies = async (req, res) => {
	const { type = "Film" } = req.query;

	const movies = await Movie.aggregate(topRatedMoviesPipeline(type));
	const mapMovies = async (m) => {
		const reviews = await getAverageRatings(m._id);
		return {
			id: m._id,
			title: m.title,
			poster: m.poster,
			responsivePosters: m.responsivePosters,
			reviews: { ...reviews },
		};
	};

	const topRatedMovies = await Promise.all(movies.map(mapMovies));
	res.json({ movies: topRatedMovies });
};

module.exports = {
	uploadTrailer,
	createMovie,
	updateMovieWithoutPoster,
	updateMovie,
	deleteMovie,
	getMovies,
	getMovieForUpdate,
	searchMovies,
	getLatestUploads,
	getSingleMovie,
	getRelatedMovies,
	getTopRatedMovies,
	searchPublicMovies,
};
