// components/Journal/JournalItem.tsx
import { format } from "date-fns";
import { FC } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion"; // 引入 framer-motion
import { FaceSmileIcon, FaceFrownIcon, FireIcon, SunIcon } from "@heroicons/react/24/outline";
import { JournalEntriesSelect } from "@self-aware-journal/db/src";

interface JournalItemProps {
  entry: JournalEntriesSelect;
  onRemove: (id: string) => void;
}

export const JournalItem: FC<JournalItemProps> = ({ entry, onRemove }) => {
  const getEmotionIcon = () => {
    let icon;
    let color;

    if (entry.emotionScore >= 75) {
      icon = <FaceSmileIcon className="h-6 w-6" />;
      color = "#F59E0B"; // yellow-500
    } else if (entry.emotionScore >= 50) {
      icon = <SunIcon className="h-6 w-6" />;
      color = "#FCD34D"; // yellow-300
    } else if (entry.emotionScore >= 25) {
      icon = <FaceFrownIcon className="h-6 w-6" />;
      color = "#FB923C"; // orange-500
    } else {
      icon = <FaceFrownIcon className="h-6 w-6" />;
      color = "#EF4444"; // red-500
    }

    return (
      <div className="flex items-center">
        <span
          className="mr-2"
          style={{ color }}
        >
          {icon}
        </span>
        <span className="text-sm text-gray-700">{entry.emotionScore}</span>
      </div>
    );
  };

  const getMoodIcon = () => {
    switch (entry.mood) {
      case "happy":
        return <FaceSmileIcon className="h-6 w-6 text-yellow-500" />;
      case "sad":
        return <FaceFrownIcon className="h-6 w-6 text-blue-500" />;
      case "excited":
        return <FireIcon className="h-6 w-6 text-red-500" />;
      case "calm":
        return <SunIcon className="h-6 w-6 text-yellow-300" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      layout
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white rounded-lg shadow flex flex-col md:flex-row justify-between items-start md:items-center"
      exit={{ opacity: 0, y: -20 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-1">
        <div className="text-sm text-gray-500 mb-1">
          {format(new Date(entry.createdAt), "PPpp")}
        </div>
        <p className="text-gray-800 mb-2">{entry.content}</p>
        <div className="flex items-center space-x-4">
          {/* 情緒分數 */}
          <div className="flex items-center">{getEmotionIcon()}</div>
          {/* 心情 */}
          <div className="flex items-center">
            {getMoodIcon()}
            <span className="ml-2 text-sm text-gray-700 capitalize">{entry.mood}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0">
        <button
          aria-label="移除日記"
          className="text-red-500 hover:text-red-700 focus:outline-none"
          disabled={false} // 現在刪除按鈕的禁用狀態由父組件管理
          title="移除日記"
          onClick={() => onRemove(entry.id)}
        >
          <TrashIcon className="h-6 w-6" />
        </button>
      </div>
    </motion.div>
  );
};
