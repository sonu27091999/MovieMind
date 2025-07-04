const {
	addReview,
	updateReview,
	removeReview,
	getReviewsByMovie,
} = require("../controller/review");
const { isAuth } = require("../middlewares/auth");
const { ratingValidator, validate } = require("../middlewares/validator");

const router = require("express").Router();

router.post("/add/:movieId", isAuth, ratingValidator, validate, addReview);
router.patch("/:reviewId", isAuth, ratingValidator, validate, updateReview);
router.delete("/:reviewId", isAuth, removeReview);
router.get("/get-reviews-by-movie/:movieId", getReviewsByMovie);

module.exports = router;
