const User = require("../models/user");
const EmailVerificationToken = require("../models/emailVerificationToken");
const { isValidObjectId } = require("mongoose");
const {
	generateOtp,
	createMailTransport,
	generateRandomByte,
} = require("../utils/mail");
const { sendError } = require("../utils/helper");
const PasswordResetToken = require("../models/passwordResetToken");
const jwt = require("jsonwebtoken");

const create = async (req, res) => {
	const { name, email, password } = req.body;
	const role = req.body?.role;
	// Check if user already exists
	const oldUser = await User.findOne({ email });
	if (oldUser) {
		return sendError(res, "Email already Registered!!!", 401);
	}
	// Create a new record
	const newUser = new User({ name, email, password });
	if (role) newUser.role = role;
	// Save the new user to database
	await newUser.save();

	// Generate 6 digit otp
	const OTP = generateOtp();
	const newEmailVerificationToken = new EmailVerificationToken({
		owner: newUser._id,
		token: OTP,
	});
	await newEmailVerificationToken.save();

	// Send verification email to user email
	const transport = await createMailTransport();

	await transport.sendMail({
		from: "verification@allThingsMovies.com",
		to: newUser.email,
		subject: "Email Verification",
		html: `
		<p>Your Verification OTP is</p>
		<h1>${OTP}</h1>`,
	});
	res.status(201).json({
		user: { id: newUser._id, name: newUser.name, email: newUser.email },
	});
};

const verifyEmail = async (req, res) => {
	const { userObjId, OTP } = req.body;
	if (!isValidObjectId(userObjId))
		return sendError(res, "Invalid User Id", 401);

	const user = await User.findById(userObjId);
	if (!user) return sendError(res, "User not found", 401);

	if (user.isVerified) return sendError(res, "User already verified", 401);

	const token = await EmailVerificationToken.findOne({ owner: userObjId });
	if (!token) return sendError(res, "Token not found", 401);

	const isMatched = await token.compareToken(OTP);
	if (!isMatched) return sendError(res, "Invalid OTP", 401);

	user.isVerified = true;
	await Promise.all([
		user.save(),
		EmailVerificationToken.findByIdAndDelete(token._id),
	]);

	// Send welcome email
	const transport = await createMailTransport();

	await transport.sendMail({
		from: "verification@allThingsMovies.com",
		to: user.email,
		subject: "Welcome to allThingsMovies",
		html: `
		<h1>We are excited to serve you at All Things Movies</h1>`,
	});

	const jwtToken = jwt.sign({ userObjId: user._id }, process.env.JWT_SECRET);
	res.status(201).json({
		user: {
			id: user._id,
			name: user.name,
			email: user.email,
			jwt: jwtToken,
			isVerified: user.isVerified,
			role: user.role
		},
		message: "Verification Successful",
	});
};

const resendEmailVerificationToken = async (req, res) => {
	const { userId } = req.body;
	if (!isValidObjectId(userId)) return sendError(res, "Invalid User Id", 401);

	const user = await User.findById(userId);
	if (!user) return sendError(res, "User not found", 401);

	if (user.isVerified) return sendError(res, "User already verified", 401);

	const existingToken = await EmailVerificationToken.findOne({
		owner: userId,
	});
	if (existingToken)
		return sendError(res, "Only one OTP allowed per hour", 401);

	// Generate 6 digit otp
	const OTP = generateOtp();
	const newEmailVerificationToken = new EmailVerificationToken({
		owner: user._id,
		token: OTP,
	});
	await newEmailVerificationToken.save();

	// Send verification email to user email
	const transport = await createMailTransport();

	await transport.sendMail({
		from: "verification@allThingsMovies.com",
		to: user.email,
		subject: "Email Verification",
		html: `
		<p>Your Verification OTP is</p>
		<h1>${OTP}</h1>`,
	});

	res
		.status(201)
		.json({ message: "Please verify your email. An OTP has been resent." });
};

const generateResetPasswordToken = async (req, res) => {
	const { email } = req.body;

	if (!email) return sendError(res, "Email must not be empty", 401);

	const user = await User.findOne({ email: email });
	if (!user) return sendError(res, "Email not found!!!", 401);

	const existingToken = await PasswordResetToken.findOne({ owner: user._id });
	if (existingToken)
		return sendError(res, "Only one OTP allowed per hour", 401);

	const token = await generateRandomByte();
	const passwordResetToken = new PasswordResetToken({
		owner: user._id,
		token: token,
	});

	await passwordResetToken.save();
	const passwordResetURL = `http://localhost:3000/auth/reset-password?token=${token}&id=${user._id}`;

	const transport = await createMailTransport();
	await transport.sendMail({
		from: "verification@allThingsMovies.com",
		to: user.email,
		subject: "Password Reset Link",
		html: `
		<h1>Click here to reset your password</h1>
		<a href=${passwordResetURL}>Reset Password</a>`,
	});
	res
		.status(201)
		.json({ message: "A Password Reset link has been sent on your email" });
};

const resetPassword = async (req, res) => {
	const { password } = req.body;

	const passwordResetTokenID = req.passwordResetTokenID;
	const user = req.user;

	const samePassword = await user.comparePassword(password);
	if (samePassword) return sendError(res, "Password cannot be same", 401);

	user.password = password;
	await Promise.all([
		user.save(),
		PasswordResetToken.findByIdAndDelete(passwordResetTokenID),
	]);

	const transport = await createMailTransport();
	await transport.sendMail({
		from: "verification@allThingsMovies.com",
		to: user.email,
		subject: "Password Reset Successful",
		html: `
		<p>Your password has been successfully changed</p>`,
	});
	res.status(201).json({ message: "Password successfully changed" });
};

const signIn = async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });
	if (!user) return sendError(res, "Email/Password mismatch!!!");

	const isMatched = await user.comparePassword(password);
	if (!isMatched) return sendError(res, "Email/Password mismatch!!!");

	const jwtToken = jwt.sign({ userObjId: user._id }, process.env.JWT_SECRET);

	res.status(201).json({
		user: {
			id: user._id,
			name: user.name,
			email,
			jwt: jwtToken,
			isVerified: user.isVerified,
			role: user.role
		},
	});
};

module.exports = {
	create,
	verifyEmail,
	resendEmailVerificationToken,
	generateResetPasswordToken,
	resetPassword,
	signIn,
};
