const nodemailer = require("nodemailer");
const crypto = require("crypto");

const generateOtp = (otpLength = 6) => {
	const OTP = Math.floor(
		10 ** (otpLength - 1) + Math.random() * (9 * 10 ** (otpLength - 1))
	).toString();
	return OTP;
};

const generateRandomByte = async () => {
	return new Promise((resolve, reject) => {
		crypto.randomBytes(30, (err, buff) => {
			if (err) reject(err);
			const randomByte = buff.toString("hex");
			resolve(randomByte);
		});
	});
};

const createMailTransport = async () => {
	const transport = await nodemailer.createTransport({
		host: "sandbox.smtp.mailtrap.io",
		port: 2525,
		auth: {
			user: process.env.NODEMAILER_USER,
			pass: process.env.NODEMAILER_PASS,
		},
	});
	return transport;
};

module.exports = {
	generateOtp,
	createMailTransport,
	generateRandomByte,
};
