import { format } from "date-fns";
import { FC } from "react";

interface JournalEntry {
  id: string;
  content: string;
  createdAt: string;
}

interface JournalItemProps {
  entry: JournalEntry;
}

export const JournalItem: FC<JournalItemProps> = ({ entry }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="text-sm text-gray-500 mb-2">{format(new Date(entry.createdAt), "PPpp")}</div>
      <p className="text-gray-800">{entry.content}</p>
    </div>
  );
};
