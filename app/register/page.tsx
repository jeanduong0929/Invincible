import React from "react";

const RegisterPage = (): JSX.Element => {
  return <div>RegisterPage</div>;
};

/* ######################################## REGISTER FORM ######################################## */

const RegisterForm = (): JSX.Element => {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const [emailError, setEmailError] = React.useState<string>("");
  const [passwordError, setPasswordError] = React.useState<string>("");
  const [registerLoading, setRegisterLoading] = React.useState<boolean>(false);

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    if (!e.target.value.trim()) {
      setEmailError("Email is required");
    } else if (!isValidEmail(e.target.value)) {
      setEmailError("Please enter a valid email");
    } else {
      setEmailError("");
    }
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
    if (!e.target.value.trim()) {
      setPasswordError("Password is required");
    } else if (!isValidPassword(e.target.value)) {
      setPasswordError(
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special case character",
      );
    } else {
      setPasswordError("");
    }
  };

  const isValidEmail = (email: string): boolean => {
    return /(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/.test(email);
  };

  const isValidPassword = (password: string): boolean => {
    return /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}/.test(password);
  };
  return (
    <>
      <form></form>
    </>
  );
};

export default RegisterPage;
