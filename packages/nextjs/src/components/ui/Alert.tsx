import React, { FC } from "react";
import clsx from "clsx";

interface AlertProps {
  message: string;
  type: "error" | "success" | "info";
}

export const Alert: FC<AlertProps> = ({ message, type }) => {
  const typeStyles = {
    error: "bg-red-100 text-red-700",
    success: "bg-green-100 text-green-700",
    info: "bg-blue-100 text-blue-700",
  };

  return <div className={clsx("p-4 mb-4 rounded", typeStyles[type])}>{message}</div>;
};
