import { catchError, getToken } from "../utils/helper";
import client from "./client";

export const addReview = async (id, reviewData) => {
	try {
		const token = getToken();
		const { data } = await client.post("/review/add" + id, reviewData, {
			headers: {
				Authorization: "Bearer " + token,
			},
		});
		return data;
	} catch (err) {
		return catchError(err);
	}
};

export const getReviewByMovie = async (movieId) => {
	try {
		const token = getToken();
		const { data } = await client("/review/get-reviews-by-movie/" + movieId);
		return data;
	} catch (err) {
		return catchError(err);
	}
};

export const deleteReview = async (id) => {
	try {
		const token = getToken();
		const { data } = await client.delete("/review/" + id, {
			headers: {
				Authorization: "Bearer " + token,
			},
		});
		return data;
	} catch (err) {
		return catchError(err);
	}
};

export const updateReview = async (reviewId, reviewData) => {
	try {
		const token = getToken();
		const { data } = await client.patch("/review/" + reviewId, reviewData, {
			headers: {
				Authorization: "Bearer " + token,
			},
		});
		return data;
	} catch (err) {
		return catchError(err);
	}
};
