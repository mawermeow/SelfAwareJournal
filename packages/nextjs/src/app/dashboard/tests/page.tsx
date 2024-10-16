"use client";

import { useEffect, useState } from "react";
import { TestCard } from "@/components/Tests/TestCard";
import { Loader } from "@/components/ui/Loader";
import usePersonalityTests from "@/server-action-hooks/usePersonalityTests";
import { PersonalityTestsSelect } from "@self-aware-journal/db/src";

interface Test {
  id: string;
  name: string;
  description: string;
}

export default function TestsPage() {
  const [tests, setTests] = useState<PersonalityTestsSelect[]>([]);
  const { data, isLoading, refetch, isFetching } = usePersonalityTests({ limit: 10 });

  useEffect(() => {
    if (!data || !data.data) return;
    setTests(data.data);
  }, [data]);

  if (isLoading) return <Loader />;

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4">心理測驗</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => (
          <TestCard
            key={test.id}
            test={test}
          />
        ))}
      </div>
    </div>
  );
}
