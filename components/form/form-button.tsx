"use client";
import React from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface FormButtonProps {
  label: string;
  loading: boolean;
  type: "button" | "submit" | "reset" | undefined;
}

const FormButton: React.FC<FormButtonProps> = ({
  label,
  loading,
  type,
}): JSX.Element => {
  return (
    <>
      <Button className="w-full" type={type}>
        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {label}
      </Button>
    </>
  );
};

export default FormButton;
