"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useSession } from "next-auth/react";

export const ProfileForm = () => {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [image, setImage] = useState(session?.user?.image || "");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 假設有 API 來更新用戶資料
    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, image }),
    });
    if (res.ok) {
      setMessage("資料已更新");
    } else {
      setMessage("更新失敗");
    }
  };

  return (
    <form
      className="bg-white p-4 rounded-lg shadow"
      onSubmit={handleSubmit}
    >
      <h3 className="text-xl font-semibold mb-4">個人資料</h3>
      {message && <div className="mb-4 text-green-500">{message}</div>}
      <Input
        required
        label="姓名"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        label="頭像 URL"
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button
        className="mt-4"
        type="submit"
        variant="primary"
      >
        保存變更
      </Button>
    </form>
  );
};
