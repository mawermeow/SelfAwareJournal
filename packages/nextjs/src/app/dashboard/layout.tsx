import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { Sidebar } from "@/components/Dashboard/Sidebar";
import { DashboardHeader } from "@/components/Dashboard/Header";

export const metadata: Metadata = {
  icons: [
    {
      rel: "icon",
      url: "/assets/favicon.svg",
      type: "image/svg+xml",
    },
  ],
  title: {
    default: "SelfAwareJournal",
    template: "%s ｜ Dashboard",
  },
  description: "",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex max-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <div className="w-full flex-1 overflow-y-scroll">{children}</div>
      </div>
    </div>
  );
}
