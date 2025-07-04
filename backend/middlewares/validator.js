const { check, validationResult } = require("express-validator");
const genres = require("../utils/genres");
const { isValidObjectId } = require("mongoose");

const userValidator = [
	check("name").trim().not().isEmpty().withMessage("Name cannot be empty!!!"),
	check("email").isEmail().withMessage("Email format invalid").normalizeEmail(),
	check("password")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Password cannot be empty!!!")
		.isLength({
			min: 8,
			max: 20,
		})
		.withMessage("Password must be of 8-20 characters"),
];

const actorValidator = [
	check("name").trim().not().isEmpty().withMessage("Name cannot be empty!!!"),
	check("about")
		.trim()
		.not()
		.isEmpty()
		.withMessage("About is a required field!"),
	check("gender")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Gender is a required field!!!"),
];

const passwordValidator = [
	check("password")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Password cannot be empty!!!")
		.isLength({
			min: 8,
			max: 20,
		})
		.withMessage("Password must be of 8-20 characters"),
];

const signInValidator = [
	check("email").isEmail().withMessage("Email format invalid").normalizeEmail(),
	check("password")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Password cannot be empty!!!"),
];

const movieValidator = [
	check("title")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Title must not be empty!!!"),
	check("storyLine")
		.trim()
		.not()
		.isEmpty()
		.withMessage("StoryLine must not be empty!!!"),
	check("status")
		.trim()
		.not()
		.isEmpty()
		.isIn(["public", "private"])
		.withMessage("Status must be either public or private!!!"),
	check("language")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Language must not be empty!!!"),
	check("type").trim().not().isEmpty().withMessage("Type must not be empty!!!"),
	check("releaseDate").isDate().withMessage("Invalid Date!!!"),
	check("genres")
		.isArray({ min: 1 })
		.withMessage("Genre must be an array of strings!")
		.custom((val) => {
			val.forEach((v) => {
				if (!genres.includes(v)) throw Error("Invalid Genre!!!");
			});
			return true;
		}),
	check("tags")
		.isArray({ min: 1 })
		.withMessage("Tags must be an array of strings!")
		.custom((tags) => {
			tags.forEach((tag) => {
				if (typeof tag !== "string") throw Error("Tag must be a string!!!");
			});
			return true;
		}),
	check("cast")
		.isArray()
		.withMessage("Cast must be an array!!!")
		.custom((cast) => {
			cast.forEach((actor) => {
				if (!isValidObjectId(actor.actor)) throw Error("Invalid Actor Id!!!");
				if (
					typeof actor.roleAs !== "string" ||
					actor.roleAs.trim().length === 0
				)
					throw Error("Role must be a valid String");
				if (typeof actor.leadActor !== "boolean")
					throw Error("Lead Actor field must be a boolean!!!");
			});
			return true;
		}),

	// check("poster").custom((_, { req }) => {
	// 	if (!req.file) throw Error("Poster must be present!!!");
	// 	return true;
	// }),
];

const validateTrailer = check("trailer")
	.isObject()
	.withMessage("Trailer Info must be an object with url and public_id!!!")
	.custom((trailer) => {
		try {
			const url = new URL(trailer.url);
			if (!url.protocol.includes("http"))
				throw Error("Trailer URL is invalid!!!");
			const arr = trailer.url.split("/");
			const publicId = arr[arr.length - 1].split(".")[0];
			if (trailer.public_id !== publicId)
				throw Error("Public ID is invalid!!!");
			return true;
		} catch (e) {
			console.log(e);
			throw Error("Trailer URL is invalid!!!");
		}
	});

const ratingValidator = check(
	"rating",
	"Rating must be a number between 0 and 10."
).isFloat({ min: 0, max: 10 });

const validate = (req, res, next) => {
	const errors = validationResult(req).array();
	if (errors.length > 0) {
		return res.json({ error: errors[0].msg });
	}
	next();
};

module.exports = {
	userValidator,
	actorValidator,
	passwordValidator,
	signInValidator,
	movieValidator,
	validateTrailer,
	ratingValidator,
	validate,
};
