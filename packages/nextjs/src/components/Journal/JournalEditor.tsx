// components/Journal/JournalEditor.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useAction } from "next-safe-action/hooks";
import { createJournalEntryAction } from "@/server-actions";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion"; // 引入 framer-motion
import { FaceSmileIcon, FaceFrownIcon, FireIcon, SunIcon } from "@heroicons/react/24/outline";

export const JournalEditor = () => {
  const [content, setContent] = useState("");
  const [emotionScore, setEmotionScore] = useState(20);
  const [mood, setMood] = useState<"happy" | "sad" | "excited" | "calm">("happy");

  const queryClient = useQueryClient();
  const { execute, hasSucceeded, isPending } = useAction(createJournalEntryAction, {
    onSuccess({ data }) {
      queryClient.refetchQueries({
        type: "active",
        queryKey: ["journalEntries"],
      });
      resetForm();
    },
    onError({ error }) {
      console.error("提交日記失敗:", error);
    },
  });

  const resetForm = () => {
    setContent("");
    setEmotionScore(20);
    setMood("happy");
  };

  const handleSubmit = () => {
    if (content.trim() === "") return;
    execute({
      emotionScore,
      content,
      mood,
    });
  };

  const getEmotionIcon = () => {
    let icon;
    let color;

    if (emotionScore >= 75) {
      icon = <FaceSmileIcon className="h-6 w-6" />;
      color = "#F59E0B"; // yellow-500
    } else if (emotionScore >= 50) {
      icon = <SunIcon className="h-6 w-6" />;
      color = "#FCD34D"; // yellow-300
    } else if (emotionScore >= 25) {
      icon = <FaceFrownIcon className="h-6 w-6" />;
      color = "#FB923C"; // orange-500
    } else {
      icon = <FaceFrownIcon className="h-6 w-6" />;
      color = "#EF4444"; // red-500
    }

    return (
      <motion.div
        animate={{ color }}
        style={{ color }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
    );
  };

  return (
    <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow">
      <Textarea
        label="新筆記"
        placeholder="寫下你此刻的想法..."
        rows={5}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* 情緒分數 */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">情緒分數</label>
        <div className="flex items-center">
          <div className="mr-2">{getEmotionIcon()}</div>
          <input
            className="flex-1"
            max="100"
            min="0"
            type="range"
            value={emotionScore}
            onChange={(e) => setEmotionScore(Number(e.target.value))}
          />
          <span className="ml-2 text-sm text-gray-700">{emotionScore}</span>
        </div>
      </div>

      {/* 心情選擇 */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">心情</label>
        <div className="flex space-x-4">
          <button
            aria-label="快樂"
            title="快樂"
            type="button"
            className={`flex flex-col items-center p-2 rounded ${
              mood === "happy" ? "bg-blue-100" : "bg-white hover:bg-gray-50"
            }`}
            onClick={() => setMood("happy")}
          >
            <FaceSmileIcon
              className="h-6 w-6"
              style={{ color: "#F59E0B" }}
            />
            <span className="text-xs mt-1">快樂</span>
          </button>
          <button
            aria-label="悲傷"
            title="悲傷"
            type="button"
            className={`flex flex-col items-center p-2 rounded ${
              mood === "sad" ? "bg-blue-100" : "bg-white hover:bg-gray-50"
            }`}
            onClick={() => setMood("sad")}
          >
            <FaceFrownIcon
              className="h-6 w-6"
              style={{ color: "#3B82F6" }}
            />
            <span className="text-xs mt-1">悲傷</span>
          </button>
          <button
            aria-label="興奮"
            title="興奮"
            type="button"
            className={`flex flex-col items-center p-2 rounded ${
              mood === "excited" ? "bg-blue-100" : "bg-white hover:bg-gray-50"
            }`}
            onClick={() => setMood("excited")}
          >
            <FireIcon
              className="h-6 w-6"
              style={{ color: "#EF4444" }}
            />
            <span className="text-xs mt-1">興奮</span>
          </button>
          <button
            aria-label="平靜"
            title="平靜"
            type="button"
            className={`flex flex-col items-center p-2 rounded ${
              mood === "calm" ? "bg-blue-100" : "bg-white hover:bg-gray-50"
            }`}
            onClick={() => setMood("calm")}
          >
            <SunIcon
              className="h-6 w-6"
              style={{ color: "#FCD34D" }}
            />
            <span className="text-xs mt-1">平靜</span>
          </button>
        </div>
      </div>

      <Button
        className="mt-4"
        disabled={isPending}
        variant="primary"
        onClick={handleSubmit}
      >
        保存筆記
      </Button>
    </div>
  );
};
