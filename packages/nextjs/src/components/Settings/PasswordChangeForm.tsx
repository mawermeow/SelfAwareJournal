"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export const PasswordChangeForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("新密碼與確認密碼不一致");
      return;
    }
    // 假設有 API 來更改密碼
    const res = await fetch("/api/user/change-password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (res.ok) {
      setMessage("密碼已更改");
      setError(null);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      const data = await res.json();
      setError(data.error || "更改密碼失敗");
      setMessage(null);
    }
  };

  return (
    <form
      className="bg-white p-4 rounded-lg shadow"
      onSubmit={handleSubmit}
    >
      <h3 className="text-xl font-semibold mb-4">更改密碼</h3>
      {message && (
        <Alert
          message={message}
          type="success"
        />
      )}
      {error && (
        <Alert
          message={error}
          type="error"
        />
      )}
      <Input
        required
        label="當前密碼"
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <Input
        required
        label="新密碼"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <Input
        required
        label="確認新密碼"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
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
