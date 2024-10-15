"use client";

import { useState, useEffect } from "react";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export const NotificationSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // 假設有 API 來獲取通知設置
    fetch("/api/user/notifications")
      .then((res) => res.json())
      .then((data) => {
        setEmailNotifications(data.emailNotifications);
      });
  }, []);

  const handleSave = async () => {
    // 假設有 API 來保存通知設置
    const res = await fetch("/api/user/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailNotifications }),
    });
    if (res.ok) {
      setMessage("通知設置已保存");
    } else {
      setMessage("保存失敗");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">通知設置</h3>
      {message && (
        <Alert
          message={message}
          type="success"
        />
      )}
      <div className="flex items-center justify-between mb-4">
        <span>電子郵件通知</span>
        <Toggle
          checked={emailNotifications}
          onCheckedChange={setEmailNotifications}
        />
      </div>
      <Button
        variant="primary"
        onClick={handleSave}
      >
        保存設置
      </Button>
    </div>
  );
};
