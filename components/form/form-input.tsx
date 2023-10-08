"use client";
import React from "react";
import { Input } from "../ui/input";

interface FormInputProps {
  placeholder: string;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  placeholder,
  type,
  value,
  onChange,
  handleBlur,
  error,
}): JSX.Element => {
  return (
    <>
      <div className="flex flex-col items-start gap-2 w-full">
        <Input
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
        />
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </>
  );
};

export default FormInput;
