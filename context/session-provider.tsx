"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";

interface SessionProps {
  children: React.ReactNode;
}

const Session: React.FC<SessionProps> = ({ children }): JSX.Element => {
  return (
    <>
      <SessionProvider>{children}</SessionProvider>
    </>
  );
};

export default Session;
