"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Loader } from "@/components/ui/Loader";

// TODO 設計問題與選項的資料結構
interface Question {
  id: string;
  question: string;
  options: string[];
}

interface Test {
  id: string;
  name: string;
  questions: Question[];
}
const createFakeTest = (id: string): Test => ({
  id,
  name: `心理測驗 ${id}`,
  questions: [
    {
      id: "1",
      question: "這是問題 1。",
      options: ["選項 A", "選項 B", "選項 C"],
    },
    {
      id: "2",
      question: "這是問題 2。",
      options: ["選項 A", "選項 B", "選項 C"],
    },
    {
      id: "3",
      question: "這是問題 3。",
      options: ["選項 A", "選項 B", "選項 C"],
    },
  ],
});

export default function TestPage() {
  const params = useParams();
  const router = useRouter();

  // 提取 testId 並確保它是 string 類型
  const testIdParam = params?.testId;
  const testId = Array.isArray(testIdParam) ? testIdParam[0] : testIdParam;

  const [test, setTest] = useState<Test | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!testId) {
      // 如果 testId 不存在，您可以選擇重定向或顯示錯誤
      router.push("/dashboard/tests");
      return;
    }

    // 假設有 API 來獲取測驗詳細信息
    // fetch(`/api/tests/${testId}`)
    //   .then((res) => res.json())
    //   .then((data: Test) => {
    //     setTest(data);
    //     setLoading(false);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching test data:", error);
    //     setLoading(false);
    //   });

    const fakeTest = createFakeTest(testId);
    setTest(fakeTest);
    setLoading(false);
  }, [testId, router]);

  const handleNext = () => {
    if (currentQuestion < (test?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      console.log({ answers });

      // 提交答案
      // fetch(`/api/tests/${testId}/submit`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ answers }),
      // })
      //   .then((res) => res.json())
      //   .then((data) => {
      //     router.push(`/dashboard/tests/${testId}/result`);
      //   })
      //   .catch((error) => {
      //     console.error("Error submitting test:", error);
      //   });
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  if (loading) return <Loader />;

  if (!test) return <div className="p-6">無法找到測驗。</div>;

  const question = test.questions[currentQuestion];

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4">{test.name}</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-medium mb-2">問題 {currentQuestion + 1}：</h3>
        <p className="mb-4">{question.question}</p>
        <RadioGroup
          options={question.options}
          selected={answers[question.id]}
          onChange={(value) => handleAnswerChange(question.id, value)}
        />
        <Button
          className="mt-4"
          disabled={!answers[question.id]}
          variant="primary"
          onClick={handleNext}
        >
          {currentQuestion < test.questions.length - 1 ? "下一題" : "提交"}
        </Button>
      </div>
    </div>
  );
}
