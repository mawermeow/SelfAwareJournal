"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // 初始化路由

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // 重置錯誤狀態
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      setLoading(false);
      if (res?.error) {
        setError(res.error);
      } else {
        // 成功登入後導航至 /dashboard
        router.push("/dashboard");
      }
    } catch (err) {
      setLoading(false);
      setError("登入過程中出現問題，請稍後再試。");
      console.error("登入錯誤:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">登入</h2>
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
            disabled={loading}
            type="submit"
            variant="primary"
          >
            {loading ? "登入中..." : "登入"}
          </Button>
        </form>
        {/* TODO 確認應用場景、加入 Apple 和 Google 開發者計畫後再開啟 */}
        {/*<div className="mt-4 text-center">*/}
        {/*  <p>或使用以下方式登入：</p>*/}
        {/*  <div className="flex justify-center space-x-4 mt-2">*/}
        {/*    <Button*/}
        {/*      variant="oauth"*/}
        {/*      onClick={() => signIn("google")}*/}
        {/*    >*/}
        {/*      Google*/}
        {/*    </Button>*/}
        {/*    <Button*/}
        {/*      variant="oauth"*/}
        {/*      onClick={() => signIn("apple")}*/}
        {/*    >*/}
        {/*      Apple*/}
        {/*    </Button>*/}
        {/*  </div>*/}
        {/*</div>*/}
        <div className="mt-6 text-center">
          <p>
            還沒有帳號？{" "}
            <a
              className="text-blue-500 hover:underline"
              href="/auth/register"
            >
              註冊
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
