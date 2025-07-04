import React, { useState } from "react";
import { forgetPassword } from "../../api/auth";
import { useNotification } from "../../hooks";
import { isValidEmail } from "../../utils/helper";
import { commonModalClasses } from "../../utils/theme";
import Container from "../Container";
import CustomLink from "../CustomLink";
import FormContainer from "../form/FormContainer";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import Title from "../form/Title";

export default function ForgetPassword() {
	const [email, setEmail] = useState("");
	const { updateNotification } = useNotification();

	const handleChange = (e) => {
		setEmail(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!email.trim() || !isValidEmail(email))
			return updateNotification("error", "Invalid Email");
		const { error, message } = await forgetPassword(email);

		if (error) return updateNotification("error", error);
		updateNotification("success", message);
	};

	return (
		<FormContainer>
			<Container>
				<form className={"w-96 " + commonModalClasses} onSubmit={handleSubmit}>
					<Title>Please enter your email</Title>
					<FormInput
						label="Email"
						name="email"
						value={email}
						onChange={handleChange}
						placeholder="john.doe@email.com"></FormInput>
					<Submit value="Send Link"></Submit>
					<div className="flex justify-between">
						<CustomLink to="/auth/signin">Sign in</CustomLink>
						<CustomLink to="/auth/signup">Sign up</CustomLink>
					</div>
				</form>
			</Container>
		</FormContainer>
	);
}
