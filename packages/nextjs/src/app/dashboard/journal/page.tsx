"use client";

import { useEffect, useState } from "react";
import { JournalEditor } from "@/components/Journal/JournalEditor";
import { JournalList } from "@/components/Journal/JournalList";
import { Loader } from "@/components/ui/Loader";

interface JournalEntry {
  id: string;
  content: string;
  createdAt: string;
}
const fakeEntries: JournalEntry[] = [
  {
    id: "1",
    content: "這是一篇測試筆記。",
    createdAt: "2021-09-01T12:00:00Z",
  },
  {
    id: "2",
    content: "這是另一篇測試筆記。",
    createdAt: "2021-09-02T12:00:00Z",
  },
];

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = () => {
    fetch("/api/journal")
      .then((res) => res.json())
      .then((data) => {
        setEntries(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    // fetchEntries();
    setEntries(fakeEntries);
    setLoading(false);
  }, []);

  const handleSave = (content: string) => {
    // 假設有 API 來保存筆記
    fetch("/api/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    })
      .then((res) => res.json())
      .then((newEntry: JournalEntry) => {
        setEntries([newEntry, ...entries]);
      });
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4">意識流筆記</h2>
      <JournalEditor onSave={handleSave} />
      <JournalList entries={entries} />
    </div>
  );
}
