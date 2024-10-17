// components/Journal/JournalList.tsx
import { JournalItem } from "@/components/Journal/JournalItem";
import { FC } from "react";
import { JournalEntriesSelect } from "@self-aware-journal/db/src";

interface JournalListProps {
  entries: JournalEntriesSelect[];
  onRemove: (id: string) => void;
}

export const JournalList: FC<JournalListProps> = ({ entries, onRemove }) => {
  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <JournalItem
          key={entry.id}
          entry={entry}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};
