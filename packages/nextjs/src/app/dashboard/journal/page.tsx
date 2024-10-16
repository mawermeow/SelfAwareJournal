"use client";

import { useEffect, useState } from "react";
import { JournalEditor } from "@/components/Journal/JournalEditor";
import { JournalList } from "@/components/Journal/JournalList";
import { Loader } from "@/components/ui/Loader";
import { useAction } from "next-safe-action/hooks";
import { submitJournalEntryAction } from "@/server-actions/submitJournalEntry";
import { JournalEntriesSelect } from "@self-aware-journal/db/src";
import useJournalEntries from "@/server-action-hooks/useJournalEntries";

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntriesSelect[]>([]);
  const { data, isLoading, refetch, isFetching } = useJournalEntries({ limit: 10 });

  useEffect(() => {
    if (!data || !data.data) return;
    setEntries(data.data);
  }, [data]);

  const { execute, result, isPending, hasSucceeded } = useAction(submitJournalEntryAction, {
    onSuccess({ data, input }) {
      if (!data) return;
      setEntries((p) => [data, ...p]);
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

  if (isLoading) return <Loader />;

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
