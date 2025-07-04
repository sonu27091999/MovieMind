import React from "react";
import { Routes, Route } from "react-router-dom";
import ConfirmPassword from "./components/auth/ConfirmPassword";
import EmailVerification from "./components/auth/EmailVerification";
import ForgetPassword from "./components/auth/ForgetPassword";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Navbar from "./components/user/Navbar";
import { useAuth } from "./hooks";
import AdminNavigator from "./navigator/AdminNavigator";
import SingleMovie from "./components/user/SingleMovie";
import MovieReviews from "./components/user/MovieReviews";
import SearchMovies from "./components/user/SearchMovies";

export default function App() {
	const { authInfo } = useAuth();
	console.log(authInfo);
	const isAdmin = authInfo.profile?.role === "admin";

	if (isAdmin) return <AdminNavigator></AdminNavigator>;
	return (
		<div>
			<Navbar></Navbar>
			<Routes>
				<Route path="/" element={<Home></Home>}></Route>
				<Route path="/auth/signin" element={<Signin></Signin>}></Route>
				<Route path="/auth/signup" element={<Signup></Signup>}></Route>
				<Route
					path="/auth/verification"
					element={<EmailVerification></EmailVerification>}></Route>
				<Route
					path="/auth/forget-password"
					element={<ForgetPassword></ForgetPassword>}></Route>
				<Route
					path="/auth/reset-password"
					element={<ConfirmPassword></ConfirmPassword>}></Route>
				<Route
					path="/movie/:movieId"
					element={<SingleMovie></SingleMovie>}></Route>
				<Route
					path="/movie/reviews/:movieId"
					element={<MovieReviews></MovieReviews>}></Route>
				<Route
					path="/movie/search"
					element={<SearchMovies></SearchMovies>}></Route>
				<Route path="*" element={<NotFound></NotFound>}></Route>
			</Routes>
		</div>
	);
}
