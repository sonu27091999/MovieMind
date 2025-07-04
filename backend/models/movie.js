const mongoose = require("mongoose");
const genres = require("../utils/genres");

const movieSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		storyLine: {
			type: String,
			required: true,
		},
		director: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Actor",
		},
		releaseDate: {
			type: Date,
			required: true,
		},
		status: {
			type: String,
			required: true,
			enum: ["public", "private"],
		},
		genres: {
			type: [String],
			enum: genres,
			required: true,
		},
		tags: {
			type: [String],
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		cast: [
			{
				actor: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Actor",
				},
				roleAs: String,
				leadActor: Boolean,
			},
		],
		writers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Actor",
			},
		],
		poster: {
			type: Object,
			url: {
				type: String,
				required: true,
			},
			public_id: {
				type: String,
				required: true,
			},
			responsive: [URL],
			required: true,
		},
		trailer: {
			type: Object,
			url: {
				type: String,
				required: true,
			},
			public_id: {
				type: String,
				required: true,
			},
			required: true,
		},
		reviews: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Review",
			},
		],
		language: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);
