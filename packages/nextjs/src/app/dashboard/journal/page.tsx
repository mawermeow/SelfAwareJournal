"use client";

import { useEffect, useState } from "react";
import { JournalEditor } from "@/components/Journal/JournalEditor";
import { JournalList } from "@/components/Journal/JournalList";
import { Loader } from "@/components/ui/Loader";
import { useAction } from "next-safe-action/hooks";
import { submitJournalEntryAction } from "@/server-actions/submitJournalEntry";
import { JournalEntriesSelect } from "@self-aware-journal/db/src";

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntriesSelect[]>([]);
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
    // setEntries(fakeEntries);
    setLoading(false);
  }, []);

  const { execute, result, isPending, hasSucceeded } = useAction(submitJournalEntryAction, {
    onSuccess({ data, input }) {
      if (!data) return;
      setEntries([data, ...entries]);
    },
    onError({ error, input }) {
      console.log("OH NO FROM ONERROR", error, input);
    },
  });

  const handleSave = async (content: string) => {
    execute({
      emotion_score: 20,
      content,
      mood: "happy",
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4">意識流筆記</h2>
      <JournalEditor
        hasSucceeded={hasSucceeded}
        onSave={handleSave}
      />
      <JournalList entries={entries} />
    </div>
  );
}
