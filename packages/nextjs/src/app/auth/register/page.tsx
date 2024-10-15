"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 假設有 API 來註冊用戶
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, password }),
    });
    if (res.ok) {
      setMessage("註冊成功，請登入");
      setError(null);
      setEmail("");
      setName("");
      setPassword("");
    } else {
      const data = await res.json();
      setError(data.error || "註冊失敗");
      setMessage(null);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">註冊</h2>
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
        <form
          className="space-y-4"
          onSubmit={handleSubmit}
        >
          <Input
            required
            label="姓名"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            required
            label="電子郵件"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            required
            label="密碼"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            className="w-full"
            type="submit"
            variant="primary"
          >
            註冊
          </Button>
        </form>
        <div className="mt-6 text-center">
          <p>
            已有帳號？{" "}
            <a
              className="text-blue-500 hover:underline"
              href="/auth/login"
            >
              登入
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
