export const metadata = {
  title: "Settings",
  description: "Manage account and website settings",
};

import UsernameForm from "@/components/UsernameForm";
import { authOptions, getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function SettingsPage() {
  const session = await getAuthSession();

  if (!session?.user) redirect(authOptions.pages?.signIn || "/sign-in");

  return (
    <div className="mac-w-4xl mx-auto py-12">
      <div className="grid items-start gap-8">
        <h1 className="font-bold text-3xl md:text-4xl">Settings</h1>
      </div>
      <div className="grid gap-10">
        <UsernameForm
          user={{
            id: session.user.id,
            username: session.user.username || "",
          }}
        />
      </div>
    </div>
  );
}
