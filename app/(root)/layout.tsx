import NavBar from "@/components/NavBar";
import { Toaster } from "@/components/ui/toaster";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    const headerList = headers();
    const redirectFrom = headerList.get("x-current-path"); // So that can track where to redirect the user to after login or sign up

    if (redirectFrom) {
      const encodedRedirectFrom = encodeURIComponent(redirectFrom);
      redirect(`/login?redirectedFrom=${encodedRedirectFrom}`);
    } else {
      redirect("/login");
    }
  }
  const user = data.user.user_metadata;
  

  return (
    <main className="font-open-sans">
      <NavBar user={user} />
      <div className="mt-16 p-6 pb-0">{children}</div>
      <Toaster />
    </main>
  );
}
