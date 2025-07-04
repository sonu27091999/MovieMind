import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useNotification } from "../../hooks";
import { isValidEmail } from "../../utils/helper";
import { commonModalClasses } from "../../utils/theme";
import Container from "../Container";
import CustomLink from "../CustomLink";
import FormContainer from "../form/FormContainer";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import Title from "../form/Title";

export default function Signin() {
	const [userInfo, setUserInfo] = useState({
		email: "",
		password: "",
	});

	const { updateNotification } = useNotification();
	const { handleLogin, authInfo } = useAuth();
	const { isLoggedIn } = authInfo;
	const navigate = useNavigate();

	const handleChange = (e) => {
		setUserInfo((prevUserInfo) => {
			const newUserInfo = { ...prevUserInfo };
			newUserInfo[e.target.name] = e.target.value;
			return newUserInfo;
		});
	};

	const validateUserInfo = (userInfo) => {
		const { email, password } = userInfo;

		if (!email.trim()) return { ok: false, error: "Email missing" };
		if (!isValidEmail(email)) return { ok: false, error: "Invalid Email" };

		if (password.length < 8) return { ok: false, error: "Invalid Password" };

		return { ok: true };
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const { ok, error } = validateUserInfo(userInfo);
		if (!ok) return updateNotification("error", error);

		handleLogin(userInfo.email, userInfo.password);
	};

	// useEffect(() => {
	// 	if (isLoggedIn) navigate("/");
	// }, [authInfo]);

	return (
		<FormContainer>
			<Container>
				<form onSubmit={handleSubmit} className={"w-72 " + commonModalClasses}>
					<Title>Sign in</Title>
					<FormInput
						label="Email"
						value={userInfo.email}
						name="email"
						onChange={handleChange}
						placeholder="john.doe@email.com"></FormInput>
					<FormInput
						label="Password"
						value={userInfo.password}
						name="password"
						onChange={handleChange}
						placeholder="********"
						type="password"></FormInput>
					<Submit value="Sign in" busy={authInfo.isPending}></Submit>
					<div className="flex justify-between">
						<CustomLink to="/auth/forget-password">Forget Password</CustomLink>
						<CustomLink to="/auth/signup">Sign up</CustomLink>
					</div>
				</form>
			</Container>
		</FormContainer>
	);
}
