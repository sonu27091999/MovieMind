import { catchError, getToken } from "../utils/helper";
import client from "./client";

export const createActor = async (formData) => {
	const token = getToken();
	try {
		const { data } = await client.post("/actor/create", formData, {
			headers: {
				Authorization: "Bearer " + token,
				"Content-Type": "multipart/form-data",
			},
		});
		return data;
	} catch (err) {
		return catchError(err);
	}
};

export const updateActor = async (id, formData) => {
	const token = getToken();
	try {
		const { data } = await client.post("/actor/update/" + id, formData, {
			headers: {
				Authorization: "Bearer " + token,
				"Content-Type": "multipart/form-data",
			},
		});
		return data;
	} catch (err) {
		return catchError(err);
	}
};

export const deleteActor = async (id) => {
	const token = getToken();
	try {
		const { data } = await client.delete("/actor/" + id, {
			headers: {
				Authorization: "Bearer " + token,
			},
		});
		return data;
	} catch (err) {
		return catchError(err);
	}
};

export const searchActor = async (query) => {
	const token = getToken();
	try {
		const { data } = await client.get(`/actor/search?name=${query}`, {
			headers: {
				Authorization: "Bearer " + token,
			},
		});
		return data;
	} catch (err) {
		return catchError(err);
	}
};

export const getActors = async (pageNo, limit) => {
	const token = getToken();
	console.log("Token: ", token);
	try {
		const { data } = await client.get(
			`/actor/actors?pageNo=${pageNo}&limit=${limit}`,

			{
				headers: {
					Authorization: "Bearer " + token,
					"Content-Type": "multipart/form-data",
				},
			}
		);
		return data;
	} catch (err) {
		return catchError(err);
	}
};

export const getActorProfile = async (id) => {
	const token = getToken();
	console.log("Token: ", token);
	try {
		const { data } = await client.get(`/actor/${id}`);
		return data;
	} catch (err) {
		return catchError(err);
	}
};
