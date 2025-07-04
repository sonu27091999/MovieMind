import React, { useEffect, useState } from "react";
import { commonModalClasses } from "../../utils/theme";
import Container from "../Container";
import FormContainer from "../form/FormContainer";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import Title from "../form/Title";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";
import { resetPassword, verifyPasswordResetToken } from "../../api/auth";
import { useNotification } from "../../hooks";

export default function ConfirmPassword() {
	const [isVerifying, setIsVerifying] = useState(true);
	const [password, setPassword] = useState({
		passwordOne: "",
		passwordTwo: "",
	});
	const [isValid, setIsValid] = useState(false);
	const { updateNotification } = useNotification();
	const navigate = useNavigate();

	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");
	const id = searchParams.get("id");
	console.log(id, token);

	useEffect(() => {
		console.log("Loading");
		isValidToken();
	}, []);

	const isValidToken = async () => {
		const { error, valid } = await verifyPasswordResetToken(token, id);
		console.log("Response: ", error, valid);
		setIsVerifying(false);
		if (error) {
			updateNotification("error", error);

			return navigate("/auth/reset-password", { replace: true });
		}
		setIsValid(true);
	};

	const handleChange = ({ target }) => {
		const { name, value } = target;
		console.log(name, value);
		setPassword({
			...password,
			[name]: value,
		});
		console.log(password);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password.passwordOne !== password.passwordTwo) {
			return updateNotification("error", "Passwords do not match!");
		}

		const { error, message } = await resetPassword(
			password.passwordOne,
			token,
			id
		);
		if (error) {
			return updateNotification("error", error);
		}

		updateNotification("success", message);
		navigate("/auth/signin", { replace: true });
	};

	if (isVerifying) {
		return (
			<FormContainer>
				<Container>
					<div className="flex space-x-2 items-center">
						<h1 className="text-4xl font-semibold dark:text-white text-primary">
							Please wait while we verify your token!
						</h1>
						<ImSpinner3 className="animate-spin text-4xl dark:text-white text-primary"></ImSpinner3>
					</div>
				</Container>
			</FormContainer>
		);
	}

	if (!isValid) {
		return (
			<FormContainer>
				<Container>
					<h1 className="text-4xl font-semibold dark:text-white text-primary">
						Sorry, the token is not valid!!!
					</h1>
				</Container>
			</FormContainer>
		);
	}
	return (
		<FormContainer>
			<Container>
				<form className={"w-96 " + commonModalClasses} onSubmit={handleSubmit}>
					<Title>Enter new password</Title>
					<FormInput
						label="New Password"
						value={password.passwordOne}
						onChange={handleChange}
						name="passwordOne"
						placeholder="********"
						type="password"></FormInput>
					<FormInput
						label="Confirm Password"
						onChange={handleChange}
						value={password.passwordTwo}
						name="passwordTwo"
						placeholder="********"
						type="password"></FormInput>
					<Submit value="Confirm Password"></Submit>
				</form>
			</Container>
		</FormContainer>
	);
}
