// dashboard/journal/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { JournalEditor } from "@/components/Journal/JournalEditor";
import { JournalList } from "@/components/Journal/JournalList";
import { Loader } from "@/components/ui/Loader";
import { JournalEntriesSelect } from "@self-aware-journal/db/src";
import useJournalEntriesInfinite from "@/server-action-hooks/useJournalEntriesInfinite";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAction } from "next-safe-action/hooks";
import { removeJournalEntryAction } from "@/server-actions";
import { AnimatePresence } from "framer-motion";

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntriesSelect[]>([]);
  const { data, isLoading, isFetching, fetchNextPage, hasNextPage } = useJournalEntriesInfinite();

  // 使用 useRef 來存儲被刪除的日記項目
  const removedEntriesRef = useRef<Map<string, JournalEntriesSelect>>(new Map());

  // 定義刪除日記的動作
  const { execute: removeEntry, isPending: isRemoving } = useAction(removeJournalEntryAction, {
    onSuccess({ data }) {
      // 操作成功後，不需要重新取得資料，因為已經進行了樂觀更新
    },
    onError({ error, input }) {
      console.error("移除日記失敗:", error);
      // 從 removedEntriesRef 中取回被刪除的日記項目
      const removedEntry = removedEntriesRef.current.get(input.id);
      if (removedEntry) {
        setEntries((prevEntries) => [removedEntry, ...prevEntries]);
        removedEntriesRef.current.delete(input.id);
      }
    },
  });

  useEffect(() => {
    if (!data) return;
    const allEntries = data.pages.flatMap((page) => page);
    setEntries(allEntries);
  }, [data]);

  const handleRemove = (id: string) => {
    const entryToRemove = entries.find((e) => e.id === id);
    if (!entryToRemove) return;
    // 將被刪除的日記項目存儲到 removedEntriesRef 中
    removedEntriesRef.current.set(id, entryToRemove);
    // 從本地狀態中移除日記項目（樂觀更新）
    setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
    // 執行刪除動作
    removeEntry({ id });
  };

  if (isLoading && entries.length === 0) return <Loader />;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">意識流筆記</h2>
      <JournalEditor />
      <InfiniteScroll
        dataLength={entries.length}
        endMessage={<p className="text-center">沒有更多日記了</p>}
        hasMore={hasNextPage}
        loader={<Loader />}
        next={fetchNextPage}
      >
        <AnimatePresence>
          <JournalList
            entries={entries}
            onRemove={handleRemove}
          />
        </AnimatePresence>
      </InfiniteScroll>
      {isFetching && <Loader />}
    </div>
  );
}
