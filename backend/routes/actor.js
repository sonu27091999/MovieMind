const express = require("express");
const {
	create,
	update,
	deleteActor,
	searchActor,
	getLatestActors,
	getSingleActor,
	getActors,
} = require("../controller/actor");
const { uploadImage } = require("../middlewares/multer");
const { actorValidator, validate } = require("../middlewares/validator");
const { isAuth, isAdmin } = require("../middlewares/auth");
const router = express.Router();

router.post(
	"/create",
	isAuth,
	isAdmin,
	uploadImage.single("avatar"),
	actorValidator,
	validate,
	create
);

router.post(
	"/update/:actorId",
	isAuth,
	isAdmin,
	uploadImage.single("avatar"),
	actorValidator,
	validate,
	update
);

router.delete("/:actorId", isAuth, isAdmin, deleteActor);
router.get("/search", isAuth, isAdmin, searchActor);
router.get("/latest-uploads", isAuth, isAdmin, getLatestActors);
router.get("/actors", isAuth, isAdmin, getActors);
router.get("/:id", getSingleActor);

module.exports = router;
