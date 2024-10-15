"use client";

import { useEffect, useState } from "react";
import { TestCard } from "@/components/Tests/TestCard";
import { Loader } from "@/components/ui/Loader";

interface Test {
  id: string;
  name: string;
  description: string;
}

const fakeTests: Test[] = [
  {
    id: "1",
    name: "心理測驗 1",
    description: "這是一個心理測驗的描述。",
  },
  {
    id: "2",
    name: "心理測驗 2",
    description: "這是一個心理測驗的描述。",
  },
  {
    id: "3",
    name: "心理測驗 3",
    description: "這是一個心理測驗的描述。",
  },
];

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 假設有 API 來獲取測驗列表
    // fetch("/api/tests")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setTests(data);
    //     setLoading(false);
    //   });
    setTests(fakeTests);
    setLoading(false);
  }, []);

  if (loading) return <Loader />;

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
