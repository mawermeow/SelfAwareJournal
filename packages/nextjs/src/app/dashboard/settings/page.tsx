"use client";

import { ProfileForm } from "@/components/Settings/ProfileForm";
import { PasswordChangeForm } from "@/components/Settings/PasswordChangeForm";
import { NotificationSettings } from "@/components/Settings/NotificationSettings";

export default function SettingsPage() {
  return (
    <div className="p-6 bg-gray-100 space-y-6">
      <h2 className="text-2xl font-semibold">設定</h2>
      <ProfileForm />
      <PasswordChangeForm />
      <NotificationSettings />
    </div>
  );
}
