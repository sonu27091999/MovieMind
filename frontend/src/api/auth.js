import { catchError } from "../utils/helper";
import client from "./client";

export const createUser = async (userInfo) => {
	try {
		const { data } = await client.post("/user/create", userInfo);
		return data;
	} catch (err) {
		return catchError(err);
	}
};

export const verifyEmail = async (body) => {
	try {
		const { data } = await client.post("/user/verify-email", body);
		return data;
	} catch (err) {
		return catchError(err);
	}
};

export const signInUser = async (body) => {
	try {
		const { data } = await client.post("/user/sign-in", body);
		return data;
	} catch (err) {
		return catchError(err);
	}
};

export const getIsAuth = async (token) => {
	try {
		const { data } = await client.get("/user/is-auth", {
			headers: {
				Authorization: "Bearer " + token,
				accept: "application/json",
			},
		});
		return data;
	} catch (err) {
		return catchError(err);
	}
};

export const forgetPassword = async (email) => {
	try {
		const { data } = await client.post("/user/forget-password", { email });
		return data;
	} catch (err) {
		return catchError(err);
	}
};

export const verifyPasswordResetToken = async (token, userId) => {
	try {
		const { data } = await client.post("/user/verifyPasswordResetToken", {
			token,
			userId,
		});
		return data;
	} catch (err) {
		return catchError(err);
	}
};

export const resetPassword = async (password, token, userId) => {
	try {
		const { data } = await client.post("/user/reset-password", {
			token,
			userId,
			password,
		});
		return data;
	} catch (err) {
		return catchError(err);
	}
};

export const resendEmailVerificationToken = async (userId) => {
	try {
		const { data } = await client.post("/user/resend-verification-email", {
			userId,
		});
		return data;
	} catch (err) {
		return catchError(err);
	}
};
