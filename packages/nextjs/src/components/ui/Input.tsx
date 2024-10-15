import { FC, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium">{label}</label>
      <input
        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
      />
    </div>
  );
};
