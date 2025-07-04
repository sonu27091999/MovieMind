const cloudinary = require("../cloud");
const Review = require("../models/review");

const sendError = (res, error, statusCode = 401) => {
	return res.status(statusCode).json({ error });
};

const handleNotFound = (req, res) => {
	sendError(res, "Not Found", 404);
};

const uploadImageToCloud = async (path) => {
	const { secure_url: url, public_id } = await cloudinary.uploader.upload(
		path,
		{ gravity: "face", height: 500, width: 500, crop: "thumb" }
	);
	return { url, public_id };
};

const parseMovieData = async (req, res, next) => {
	const { genres, tags, cast, writers, trailer } = req.body;
	if (trailer) req.body.trailer = JSON.parse(trailer);
	if (genres) req.body.genres = JSON.parse(genres);
	if (tags) req.body.tags = JSON.parse(tags);
	if (cast) req.body.cast = JSON.parse(cast);
	if (writers) req.body.writers = JSON.parse(writers);
	next();
};

const formatActor = (actor) => {
	const { name, gender, about, _id, avatar } = actor;
	return {
		id: _id,
		name,
		about,
		gender,
		avatar: avatar?.url,
	};
};

const averageRatingPipeline = (movieId) => {
	return [
		{
			$lookup: {
				from: "Review",
				localField: "rating",
				foreignField: "_id",
				as: "avgRat",
			},
		},
		{
			$match: { parentMovie: movieId },
		},
		{
			$group: {
				_id: null,
				ratingAvg: {
					$avg: "$rating",
				},
				reviewsCount: {
					$sum: 1,
				},
			},
		},
	];
};

const relatedMovieAggregation = (tags, movieId) => {
	return [
		{
			$lookup: {
				from: "Movie",
				localField: "tags",
				foreignField: "_id",
				as: "relatedMovies",
			},
		},
		{
			$match: {
				tags: {
					$in: [...tags],
					_id: { $ne: movie._id },
				},
			},
		},
		{
			$project: {
				title: 1,
				poster: "$poster.url",
				responsivePosters: "$poster.responsive",
			},
		},
		{
			$limit: 5,
		},
	];
};

const topRatedMoviesPipeline = (type) => {
	const matchOptions = {
		reviews: { $exists: true },
		status: { $eq: "public" },
	};
	if (type) matchOptions.type = { $eq: type };
	return [
		{
			$lookup: {
				from: "Movie",
				localField: "reviews",
				foreignField: "_id",
				as: "topRated",
			},
		},
		{
			$match: matchOptions,
		},
		{
			$project: {
				title: 1,
				poster: "$poster.url",
				responsivePosters: "$poster.responsive",
				reviewCount: {
					$size: "$reviews",
				},
			},
		},
		{
			$sort: {
				reviewCount: -1,
			},
		},
		{
			$limit: 5,
		},
	];
};

const getAverageRatings = async (movieId) => {
	const [aggregatedResponse] = await Review.aggregate(
		averageRatingPipeline(movieId)
	);

	const reviews = {};
	if (aggregatedResponse) {
		const { ratingAvg, reviewCount } = aggregatedResponse;
		reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1);
		reviews.reviewCount = reviewCount;
	}
	return reviews;
};

module.exports = {
	sendError,
	handleNotFound,
	uploadImageToCloud,
	parseMovieData,
	formatActor,
	averageRatingPipeline,
	relatedMovieAggregation,
	getAverageRatings,
	topRatedMoviesPipeline,
};
