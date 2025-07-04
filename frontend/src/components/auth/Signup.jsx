import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../api/auth";
import { useAuth, useNotification } from "../../hooks";
import { isValidEmail, isValidName } from "../../utils/helper";
import { commonModalClasses } from "../../utils/theme";
import Container from "../Container";
import CustomLink from "../CustomLink";
import FormContainer from "../form/FormContainer";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import Title from "../form/Title";

export default function Signup() {
	const navigate = useNavigate();
	const { updateNotification } = useNotification();
	const { authInfo } = useAuth();
	const { isLoggedIn } = authInfo;

	const [userInfo, setUserInfo] = useState({
		name: "",
		email: "",
		password: "",
	});
	const { name, email, password } = userInfo;

	const handleChange = (e) => {
		setUserInfo((prevUserInfo) => {
			const newUserInfo = { ...prevUserInfo };
			newUserInfo[e.target.name] = e.target.value;
			return newUserInfo;
		});
	};

	const validateUserInfo = (userInfo) => {
		const { name, email, password } = userInfo;
		if (!name.trim()) return { ok: false, error: "Name missing" };
		if (!isValidName(name)) return { ok: false, error: "Invalid Name" };

		if (!email.trim()) return { ok: false, error: "Email missing" };
		if (!isValidEmail(email)) return { ok: false, error: "Invalid Email" };

		if (password.length < 8) return { ok: false, error: "Invalid Password" };

		return { ok: true };
	};

	const handleSubmit = async (e) => {
		// Prevent the page from loading
		e.preventDefault();
		const { ok, error } = validateUserInfo(userInfo);
		if (!ok) return updateNotification("error", error);

		const response = await createUser(userInfo);
		if (response.error) return updateNotification("error", response.error);
		navigate("/auth/verification", {
			state: { user: response.user },
			replace: true,
		});
	};

	useEffect(() => {
		if (isLoggedIn) navigate("/");
	}, [isLoggedIn]);

	return (
		<FormContainer>
			<Container>
				<form onSubmit={handleSubmit} className={"w-72 " + commonModalClasses}>
					<Title>Sign Up</Title>
					<FormInput
						value={name}
						onChange={(e) => handleChange(e)}
						label="Name"
						name="name"
						placeholder="John Doe"></FormInput>
					<FormInput
						value={email}
						onChange={(e) => handleChange(e)}
						label="Email"
						name="email"
						placeholder="john.doe@email.com"></FormInput>
					<FormInput
						value={password}
						onChange={(e) => handleChange(e)}
						label="Password"
						name="password"
						placeholder="********"
						type="password"></FormInput>
					<Submit value="Sign Up"></Submit>
					<div className="flex justify-between">
						<CustomLink to="/auth/forget-password">Forget Password</CustomLink>
						<CustomLink to="/auth/signin">Sign in</CustomLink>
					</div>
				</form>
			</Container>
		</FormContainer>
	);
}
