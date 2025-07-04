const express = require("express");

const {
	create,
	verifyEmail,
	resendEmailVerificationToken,
	generateResetPasswordToken,
	resetPassword,
	signIn,
} = require("../controller/user");

const {
	userValidator,
	validate,
	passwordValidator,
	signInValidator,
} = require("../middlewares/validator");

const { isValidPasswordResetToken } = require("../middlewares/user");
const { isAuth } = require("../middlewares/auth");

const router = express.Router();

router.post("/create", userValidator, validate, create);

router.post("/verify-email", verifyEmail);

router.post("/resend-verification-email", resendEmailVerificationToken);

router.post("/forget-password", generateResetPasswordToken);

router.post(
	"/verifyPasswordResetToken",
	isValidPasswordResetToken,
	(req, res) => res.json({ valid: true })
);

router.post(
	"/reset-password",
	passwordValidator,
	validate,
	isValidPasswordResetToken,
	resetPassword
);

router.post("/sign-in", signInValidator, validate, signIn);

router.get("/is-auth", isAuth, (req, res) => {
	const { user } = req;
	res.status(201).json({
		user: {
			id: user._id,
			name: user.name,
			email: user.email,
			isVerified: user.isVerified,
			role: user.role
		},
	});
});

module.exports = router;
