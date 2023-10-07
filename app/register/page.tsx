"use client";
import FormButton from "@/components/form/form-button";
import FormInput from "@/components/form/form-input";
import GithubButton from "@/components/form/github-button";
import { useToast } from "@/components/ui/use-toast";
import instance from "@/lib/axios-config";
import { WebhookIcon } from "lucide-react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
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

  // Custom hooks
  const { toast } = useToast();
  const router = useRouter();

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
  ): Promise<void> => {
    e.preventDefault();
    setRegisterLoading(true);
    try {
      // Make request to sign up user
      await instance.post("/auth/register", {
        email,
        password,
      });

      // Show success toaster
      toast({
        description: "Account created successfully",
        className: "bg-green-500 text-white",
      });

      // Reset form
      resetForm();

      // Redirect to login screen
      router.push("/login");
    } catch (error: any) {
      console.error(error);
      // If email is already taken set email error
      if (error.response && error.response.status === 409) {
        setEmailError("Email is already taken");
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  const isValidEmail = (email: string): boolean => {
    return /(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/.test(email);
  };

  const isValidPassword = (password: string): boolean => {
    return /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}/.test(password);
  };

  const resetForm = (): void => {
    setEmail("");
    setPassword("");
    setEmailError("");
    setPasswordError("");
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
              Enter your email to sign up for an account
            </h2>
          </div>

          {/* Content */}
          <div className="flex flex-col w-full gap-2">
            {/* Email */}
            <FormInput
              placeholder={"name@example.com"}
              type={"email"}
              value={email}
              onChange={handleEmail}
              handleBlur={handleEmail}
              error={emailError}
            />

            {/* Password */}
            <FormInput
              placeholder={"Password"}
              type={"password"}
              value={password}
              onChange={handlePassword}
              handleBlur={handlePassword}
              error={passwordError}
            />

            {/* Submit */}
            <FormButton
              label={"Sign Up with Email"}
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
