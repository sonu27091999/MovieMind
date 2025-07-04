const { isValidObjectId } = require("mongoose");
const { sendError, getAverageRatings } = require("../utils/helper");
const Movie = require("../models/movie");
const Review = require("../models/review");

exports.addReview = async (req, res) => {
	const { movieId } = req.params;
	const { content, rating } = req.body;
	const userId = req.user._id;
	if (!req.user.isVerified)
		return sendError(res, "Please Verify your email first");

	if (!isValidObjectId(movieId)) return sendError(res, "Invalid Movie Id");

	const movie = await Movie.findOne({ _id: movieId, status: "public" });
	if (!movie) return sendError(res, "Movie Not found!!!", 404);

	const isAlreadyReviewed = await Review.findOne({
		owner: userId,
		parentMovie: movieId,
	});

	if (isAlreadyReviewed) return sendError(res, "Already reviewed!!!");

	const newReview = new Review({
		owner: userId,
		parentMovie: movie._id,
		content,
		rating,
	});
	movie.reviews.push(newReview._id);
	await movie.save();
	await newReview.save();
	const reviews = await getAverageRatings(movie._id);

	res.json({ message: "Your review has been added", reviews });
};

exports.updateReview = async (req, res) => {
	const { reviewId } = req.params;
	const { content, rating } = req.body;
	const userId = req.user._id;

	if (!isValidObjectId(reviewId)) return sendError(res, "Invalid Review Id");

	const review = await Review.findOne({ owner: userId, _id: reviewId });
	if (!review) return sendError(res, "Review not found", 404);

	review.content = content;
	review.rating = rating;
	await review.save();
	res.json({ message: "Your review has been updated" });
};

exports.removeReview = async (req, res) => {
	const { reviewId } = req.params;
	const userId = req.user._id;

	if (!isValidObjectId(reviewId)) return sendError(res, "Invalid Review Id");

	const review = await Review.findOne({ owner: userId, _id: reviewId });
	if (!review) return sendError(res, "Review not found", 404);

	const movie = await Movie.findById(review.parentMovie).select("review");
	movie.reviews = movie.reviews.filter((rId) => rId.toString() !== reviewId);

	await Review.findByIdAndDelete(reviewId);
	movie.save();

	res.json({ message: "Your review has been deleted" });
};

exports.getReviewsByMovie = async (req, res) => {
	const { movieId } = req.params;

	if (!isValidObjectId(movieId)) return sendError(res, "Invalid Movie Id");

	const movie = await Movie.findById(movieId)
		.populate({
			path: "reviews",
			populate: { path: "owner", select: "name" },
		})
		.select("reviews title");

	const formattedReviews = movie.reviews.map((r) => {
		const { owner, content, rating, _id: reviewId } = r;
		const { name, _id: ownerId } = owner;
		return {
			id: reviewId,
			owner: {
				id: ownerId,
				name,
			},
			content,
			rating,
		};
	});

	res.json({ movie: { title: movie.title, reviews: formattedReviews } });
};
