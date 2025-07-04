import React, { createContext, useEffect } from "react";

export const ThemeContext = createContext();

const defaultTheme = "light";
const darkTheme = "dark";

const getTheme = () => {
	return localStorage.getItem("theme");
};

const updateTheme = (newTheme, oldTheme) => {
	if (oldTheme) document.documentElement.classList.remove(oldTheme);
	document.documentElement.classList.add(newTheme);
	localStorage.setItem("theme", newTheme);
};

export default function ThemeProvider({ children }) {
	const toggleTheme = () => {
		const oldTheme = getTheme();
		const newTheme = oldTheme === defaultTheme ? darkTheme : defaultTheme;
		updateTheme(newTheme, oldTheme);
	};

	useEffect(() => {
		const theme = getTheme() || defaultTheme;
		updateTheme(theme);
	}, []);

	return (
		<ThemeContext.Provider value={{ toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}
