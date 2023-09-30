"use client";
import FormButton from "@/components/form/form-button";
import FormInput from "@/components/form/form-input";
import GithubButton from "@/components/form/github-button";
import Loading from "@/components/loading";
import { WebhookIcon } from "lucide-react";
import React from "react";

const LoginPage = (): JSX.Element => {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-[350px]  mx-auto h-[70vh]">
        <LoginForm />
      </div>
    </>
  );
};

/* ######################################## LOGIN FORM ######################################## */

const LoginForm = () => {
  // Form states
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  // Form errors
  const [error, setError] = React.useState<string>("");

  // Loading state
  const [signInLoading, setSignInLoading] = React.useState<boolean>(false);

  const handleForm = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setSignInLoading(true);
    try {
    } catch (error: any) {
      console.error(error);
    } finally {
      setSignInLoading(false);
    }
  };

  return (
    <>
      {/* Form container */}
      <form
        className="flex flex-col items-center gap-5 w-full"
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
            error={error}
          />
          <FormButton
            label={"Sign In with Email"}
            loading={signInLoading}
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
    </>
  );
};

export default LoginPage;
