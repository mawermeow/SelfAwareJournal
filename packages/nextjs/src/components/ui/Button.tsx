import clsx from "clsx";
import { ButtonHTMLAttributes, FC } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "oauth";
}

export const Button: FC<ButtonProps> = ({ children, variant = "primary", className, ...props }) => {
  const baseStyle = "px-4 py-2 rounded-md font-semibold focus:outline-none";
  const variantStyles = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    oauth: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
  };

  return (
    <button
      className={clsx(baseStyle, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};
