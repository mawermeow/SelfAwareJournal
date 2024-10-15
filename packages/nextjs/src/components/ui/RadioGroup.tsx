import { FC } from "react";

interface RadioGroupProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

export const RadioGroup: FC<RadioGroupProps> = ({ options, selected, onChange }) => {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <label
          key={option}
          className="flex items-center space-x-2"
        >
          <input
            checked={selected === option}
            className="form-radio h-4 w-4 text-blue-600"
            name="radio-group"
            type="radio"
            value={option}
            onChange={() => onChange(option)}
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
};
