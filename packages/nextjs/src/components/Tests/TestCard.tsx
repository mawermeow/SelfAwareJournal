import Link from "next/link";
import { FC } from "react";
import { PersonalityTestsSelect } from "@self-aware-journal/db/src";

interface Test {
  id: string;
  name: string;
  description: string;
}

interface TestCardProps {
  test: PersonalityTestsSelect;
}

export const TestCard: FC<TestCardProps> = ({ test }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
      <h3 className="text-xl font-bold mb-2">{test.name}</h3>
      <p className="text-gray-600 mb-4">{test.description}</p>
      <Link href={`/dashboard/tests/${test.id}`}>
        <div className="text-blue-500 hover:underline">開始測驗</div>
      </Link>
    </div>
  );
};
