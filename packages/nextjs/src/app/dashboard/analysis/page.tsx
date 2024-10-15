"use client";

import { useEffect, useState } from "react";
import { EmotionChart } from "@/components/Analysis/EmotionChart";
import { ReflectionSection } from "@/components/Analysis/ReflectionSection";
import { Loader } from "@/components/ui/Loader";

interface AnalysisData {
  emotionAnalysis: Record<string, number>;
  reflection: string;
  suggestions: string[];
}
const fakeAnalysis: AnalysisData = {
  emotionAnalysis: {
    anger: 0.1,
    fear: 0.2,
    joy: 0.6,
    sadness: 0.1,
  },
  reflection: "這是一段測試反思。",
  suggestions: ["建議 1", "建議 2", "建議 3"],
};

export default function AnalysisPage() {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch("/api/analysis")
    //   .then((res) => res.json())
    //   .then((data: AnalysisData) => {
    //     setData(data);
    //     setLoading(false);
    //   });
    setData(fakeAnalysis);
    setLoading(false);
  }, []);

  if (loading) return <Loader />;

  if (!data) return <div className="p-6">尚無分析數據。</div>;

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4">分析報告</h2>
      <EmotionChart data={data.emotionAnalysis} />
      <ReflectionSection reflection={data.reflection} />
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">建議</h3>
        <ul className="list-disc list-inside">
          {data.suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="text-gray-700"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
