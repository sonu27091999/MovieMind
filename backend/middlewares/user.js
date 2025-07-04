const { isValidObjectId } = require("mongoose");
const PasswordResetToken = require("../models/passwordResetToken");
const User = require("../models/user");
const { sendError } = require("../utils/helper");

const isValidPasswordResetToken = async (req, res, next) => {
	const { token, userId } = req.body;

	if (!token.trim() || !isValidObjectId(userId))
		return sendError(res, "Invalid Request", 401);

	const user = await User.findById(userId);
	if (!user) return sendError(res, "User not found", 401);

	const passwordResetToken = await PasswordResetToken.findOne({
		owner: userId,
	});
	if (!passwordResetToken) return sendError(res, "No reset token found", 401);
	const isMatched = await passwordResetToken.compareToken(token);
	if (!isMatched)
		return sendError(res, "Password Reset Token is not valid", 401);

	req.passwordResetTokenID = passwordResetToken._id;
	req.user = user;
	next();
};

module.exports = {
	isValidPasswordResetToken,
};
