"use client";

import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
interface JournalEditorProps {
  hasSucceeded: boolean;
  onSave: (content: string) => void;
}

export const JournalEditor: FC<JournalEditorProps> = ({ hasSucceeded, onSave }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (hasSucceeded) {
      setContent("");
    }
  }, [hasSucceeded]);

  const handleSubmit = () => {
    if (content.trim() === "") return;
    onSave(content);
  };

  return (
    <div className="mb-6">
      <Textarea
        label="新筆記"
        placeholder="寫下你此刻的想法..."
        rows={5}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button
        className="mt-2"
        variant="primary"
        onClick={handleSubmit}
      >
        保存筆記
      </Button>
    </div>
  );
};
