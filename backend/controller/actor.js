const { isValidObjectId } = require("mongoose");
const Actor = require("../models/actor");
const { sendError, uploadImageToCloud } = require("../utils/helper");
const cloudinary = require("../cloud");

const create = async (req, res) => {
	const { name, about, gender } = req.body;
	const { file } = req;
	const newActor = new Actor({
		name,
		about,
		gender,
	});
	if (file) {
		const { url, public_id } = await uploadImageToCloud(file.path);
		newActor.avatar = {
			url,
			public_id,
		};
	}
	await newActor.save();
	res.status(201).json({ actor: formatActor(newActor) });
};

const update = async (req, res) => {
	const { name, gender, about } = req.body;
	const { file } = req;
	const actorId = req.params.actorId;

	if (!isValidObjectId(actorId))
		return sendError(res, "Invalid Request! Actor ID not valid!");

	const actor = await Actor.findById(actorId);
	if (!actor) return sendError(res, "Invalid Request! Actor not found!");

	// Delete file if new file present and old exists
	const public_id = actor.avatar?.public_id;
	if (file && public_id) {
		const { result } = await cloudinary.uploader.destroy(public_id);
		if (result !== "ok")
			return sendError(res, "Unable to delete the file from cloud!");
	}

	if (file) {
		const { url, public_id } = await uploadImageToCloud(file.path);
		actor.avatar = {
			url,
			public_id,
		};
	}
	actor.name = name;
	actor.about = about;
	actor.gender = gender;
	await actor.save();
	res.status(201).json({ actor: formatActor(actor) });
};

const deleteActor = async (req, res) => {
	const actorId = req.params.actorId;

	if (!isValidObjectId(actorId))
		return sendError(res, "Invalid Request! Actor ID not valid!");

	const actor = await Actor.findById(actorId);
	if (!actor) return sendError(res, "Invalid Request! Actor not found!", 404);

	// Delete file if new file present and old exists
	const public_id = actor.avatar?.public_id;
	if (public_id) {
		const { result } = await cloudinary.uploader.destroy(public_id);
		if (result !== "ok")
			return sendError(res, "Unable to delete the file from cloud!");
	}

	await Actor.findByIdAndDelete(actorId);
	res.json({ message: "Actor deleted successfully" });
};

const searchActor = async (req, res) => {
	const { name } = req.query;
	if (!name) return sendError(res, "Invalid Request!!");

	// const result = await Actor.find({ $text: { $search: `"${query.name}"` } });
	const result = await Actor.find({
		name: { $regex: name, $options: "i" },
	});
	const actors = result.map((actor) => formatActor(actor));
	res.json({ results: actors });
};

const getLatestActors = async (req, res) => {
	const result = await Actor.find().sort({ createdAt: -1 }).limit(12);
	const actors = result.map((actor) => formatActor(actor));
	res.json(actors);
};

const getSingleActor = async (req, res) => {
	const actorId = req.params.id;
	if (!isValidObjectId(actorId))
		return sendError(res, "Invalid Request! Actor ID not valid!");

	const actor = await Actor.findById(actorId);
	if (!actor) return sendError(res, "Invalid Request! Actor not found!", 404);
	res.json({ actor: formatActor(actor) });
};

const formatActor = (actor) => {
	const { _id: id, name, gender, about, avatar } = actor;
	return {
		id,
		name,
		gender,
		about,
		avatar: avatar?.url,
	};
};

const getActors = async (req, res) => {
	const { pageNo, limit } = req.query;

	const actors = await Actor.find({})
		.sort({ createdAt: -1 })
		.skip(parseInt(pageNo) * parseInt(limit))
		.limit(parseInt(limit));

	res.json({
		profiles: actors.map((actor) => formatActor(actor)),
	});
};

module.exports = {
	create,
	update,
	deleteActor,
	searchActor,
	getLatestActors,
	getSingleActor,
	getActors,
};
