"use client";

import { FC, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

interface JournalEditorProps {
  onSave: (content: string) => void;
}

export const JournalEditor: FC<JournalEditorProps> = ({ onSave }) => {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (content.trim() === "") return;
    onSave(content);
    setContent("");
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
