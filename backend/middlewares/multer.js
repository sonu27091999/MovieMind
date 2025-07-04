const multer = require("multer");
const storage = multer.diskStorage({});

const imageFileFilter = (req, file, cb) => {
	if (!file.mimetype.startsWith("image")) cb("File type not supported!", false);
	cb(null, true);
};

const videoFileFilter = (req, file, cb) => {
	if (!file.mimetype.startsWith("video")) cb("File type not supported!", false);
	cb(null, true);
};

const uploadImage = multer({ storage, fileFilter: imageFileFilter });
const uploadVideo = multer({ storage, fileFilter: videoFileFilter });

module.exports = {
	uploadImage,
	uploadVideo,
};
