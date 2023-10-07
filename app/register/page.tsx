"use client";
import FormButton from "@/components/form/form-button";
import FormInput from "@/components/form/form-input";
import GithubButton from "@/components/form/github-button";
import { WebhookIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const RegisterPage = (): JSX.Element => {
  return (
    <div className="w-full h-full flex justify-between">
      <div className="w-1/2 h-screen bg-slate-900" />
      <RegisterForm />
    </div>
  );
};

/* ######################################## REGISTER FORM ######################################## */

const RegisterForm = (): JSX.Element => {
  // Form states
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  // Form errors
  const [emailError, setEmailError] = React.useState<string>("");
  const [passwordError, setPasswordError] = React.useState<string>("");

  // Loading states
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

  const handleForm = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {};

  const isValidEmail = (email: string): boolean => {
    return /(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/.test(email);
  };

  const isValidPassword = (password: string): boolean => {
    return /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}/.test(password);
  };
  return (
    <>
      <div className="w-1/2 flex flex-col items-center">
        {/* Form container */}
        <form
          className="flex flex-col items-center justify-center gap-5 w-[350px] h-[70vh]"
          onSubmit={handleForm}
        >
          {/* Header */}
          <div className="flex flex-col items-center gap-1 w-full">
            <WebhookIcon size={30} />
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <h2 className="text-slate-500">
              Enter your email to sign in to your account
            </h2>
          </div>

          {/* Content */}
          <div className="flex flex-col w-full gap-2">
            <FormInput
              placeholder={"name@example.com"}
              type={"email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
            />
            <FormButton
              label={"Sign In with Email"}
              loading={registerLoading}
              type={"submit"}
            />

            {/* Footer */}
            <div className="flex items-center w-full gap-2">
              <hr className="w-full" />
              <p>OR</p>
              <hr className="w-full" />
            </div>

            <GithubButton />
          </div>
        </form>
      </div>
    </>
  );
};

export default RegisterPage;
