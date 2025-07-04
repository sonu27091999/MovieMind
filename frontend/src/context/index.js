import React from "react";
import AuthProvider from "./AuthProvider";
import NotificationProvider from "./NotificationProvider";
import ThemeProvider from "./ThemeProvider";
import SearchProvider from "./SearchProvider";
import MoviesProvider from "./MoviesProvider";

export default function ContextProviders({ children }) {
	return (
		<NotificationProvider>
			<SearchProvider>
				<MoviesProvider>
					<AuthProvider>
						<ThemeProvider>{children}</ThemeProvider>
					</AuthProvider>
				</MoviesProvider>
			</SearchProvider>
		</NotificationProvider>
	);
}
