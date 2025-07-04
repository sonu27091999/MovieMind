const isValidEmail = (email) => {
	const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
	return emailRegex.test(email);
};

const isValidName = (name) => {
	const userRegex = /[A-Z a-z]+$/;
	return userRegex.test(name);
};

const getToken = () => {
	const token = localStorage.getItem("auth-token");
	return token;
};

const catchError = (err) => {
	const { response } = err;
	if (response?.data) return response.data;
	return err.message || err;
};

const renderItem = (result) => {
	return (
		<div key={result.id} className="flex space-x-2 rounded overflow-hidden">
			<img
				src={result.avatar}
				alt={result.name}
				className="w-16 h-16 object-cover"></img>
			<p className="dark:text-white font-semibold">{result.name}</p>
		</div>
	);
};

const getPoster = (posters = []) => {
	const { length } = posters;
	if (!length) return null;

	if (length > 2) return posters[1];
	return posters[0];
};

export {
	isValidEmail,
	isValidName,
	getToken,
	catchError,
	renderItem,
	getPoster,
};
