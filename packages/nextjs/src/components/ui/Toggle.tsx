import React from "react";
import * as Switch from "@radix-ui/react-switch";

interface ToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onCheckedChange }) => {
  return (
    <Switch.Root
      checked={checked}
      className="w-10 h-6 bg-gray-300 rounded-full relative focus:outline-none focus:ring-2 focus:ring-blue-500"
      onCheckedChange={onCheckedChange}
    >
      <Switch.Thumb
        className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </Switch.Root>
  );
};
