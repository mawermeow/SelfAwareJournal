"use client";

import { useSession, signOut } from "next-auth/react";
import { UserCircleIcon } from "@heroicons/react/24/outline";

export const DashboardHeader = () => {
  const { data: session } = useSession();

  return (
    <header className="flex justify-between items-center p-4 bg-white border-b">
      <h1 className="text-2xl font-semibold">儀表板</h1>
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <UserCircleIcon className="w-8 h-8 text-gray-500" />
          <span className="ml-2">{session?.user?.name}</span>
        </div>
        <button
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() =>
            signOut({
              callbackUrl: "/auth/login",
            })
          }
        >
          登出
        </button>
      </div>
    </header>
  );
};
