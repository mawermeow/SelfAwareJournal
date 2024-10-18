// components/Journal/JournalList.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  PencilSquareIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { ReactNode } from "react";

interface NavItem {
  name: string;
  href: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  { name: "儀表板", href: "/dashboard", icon: <HomeIcon className="w-5 h-5" /> },
  {
    name: "心理測驗",
    href: "/dashboard/tests",
    icon: <ClipboardDocumentListIcon className="w-5 h-5" />,
    // TODO 確認一下 Icon
  },
  {
    name: "意識流筆記",
    href: "/dashboard/journal",
    icon: <PencilSquareIcon className="w-5 h-5" />,
    // TODO 確認一下 Icon
  },
  { name: "分析報告", href: "/dashboard/analysis", icon: <ChartBarIcon className="w-5 h-5" /> },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r">
      <div className="p-4 text-xl font-bold">自覺筆記</div>
      <nav className="mt-10">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
          >
            <div
              className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-200 ${
                pathname === item.href ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
};
