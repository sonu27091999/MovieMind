import { catchError, getToken } from "../utils/helper";
import client from "./client";

export const uploadTrailer = async (formData, onProgressCallback) => {
	try {
		const token = getToken();
		const { data } = await client.post("/movie/upload-trailer", formData, {
			headers: {
				Authorization: "Bearer " + token,
				"Content-Type": "multipart/form-data",
			},
			onUploadProgress: ({ loaded, total }) => {
				onProgressCallback(Math.floor((loaded / total) * 100));
			},
		});
		return data;
	} catch (err) {
		return catchError(err);
	}
};

export const uploadMovie = async (formData) => {
	try {
		const token = getToken();
		const { data } = await client.post("/movie/create", formData, {
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

export const getMovies = async (pageNo, limit) => {
	try {
		const token = getToken();
		const { data } = await client.get(
			`/movie/movies?pageNo=${pageNo}&limit=${limit}`,
			{
				headers: {
					Authorization: "Bearer " + token,
				},
			}
		);
		return data;
	} catch (err) {
		return catchError(err);
	}
};

export const getMovieForUpdate = async (id) => {
	try {
		const token = getToken();
		const { data } = await client.get("/movie/for-update/" + id, {
			headers: {
				Authorization: "Bearer " + token,
			},
		});
		return data;
	} catch (err) {
		return catchError(err);
	}
};

export const updateMovie = async (id, formData) => {
	try {
		const token = getToken();
		const { data } = await client.patch("/movie/update/" + id, formData, {
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

export const deleteMovie = async (id) => {
	try {
		const token = getToken();
		const { data } = await client.delete("/movie/" + id, {
			headers: {
				Authorization: "Bearer " + token,
			},
		});
		return data;
	} catch (err) {
		return catchError(err);
	}
};

export const searchMoviesForAdmin = async (title) => {
	try {
		const token = getToken();
		const { data } = await client.get("/movie/search?title=" + title, {
			headers: {
				Authorization: "Bearer " + token,
			},
		});
		return data;
	} catch (err) {
		return catchError(err);
	}
};

export const getTopRatedMovies = async (type, signal) => {
	try {
		let endpoint = "/movie/top-rated";
		if (type) endpoint = endpoint + "?type=" + type;
		const { data } = await client(endpoint, { signal });
		return data;
	} catch (err) {
		return catchError(err);
	}
};

export const getLatestUploads = async (signal) => {
	try {
		const { data } = await client("/movie/latest-uploads", { signal: signal });
		return data;
	} catch (err) {
		return catchError(err);
	}
};

export const getSingleMovie = async (id) => {
	try {
		const { data } = await client("/movie/single/" + id);
		return data;
	} catch (err) {
		return catchError(err);
	}
};

export const getRelatedMovies = async (id) => {
	try {
		const { data } = await client("/movie/related/" + id);
		return data;
	} catch (err) {
		return catchError(err);
	}
};

export const searchPublicMovies = async (title) => {
	try {
		const { data } = await client("/movie/search-public?title=" + title);
		return data;
	} catch (err) {
		return catchError(err);
	}
};
