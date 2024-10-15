import { FC } from "react";

interface ReflectionSectionProps {
  reflection: string;
}

export const ReflectionSection: FC<ReflectionSectionProps> = ({ reflection }) => {
  return (
    <div className="mt-6 bg-white p-4 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-2">今日反思</h3>
      <p className="text-gray-800">{reflection}</p>
    </div>
  );
};
