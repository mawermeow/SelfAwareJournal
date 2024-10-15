import { JournalItem } from "@/components/Journal/JournalItem";
import { FC } from "react";

interface JournalEntry {
  id: string;
  content: string;
  createdAt: string;
}

interface JournalListProps {
  entries: JournalEntry[];
}

export const JournalList: FC<JournalListProps> = ({ entries }) => {
  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <JournalItem
          key={entry.id}
          entry={entry}
        />
      ))}
    </div>
  );
};
