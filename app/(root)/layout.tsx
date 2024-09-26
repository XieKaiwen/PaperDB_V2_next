import NavBar from "@/components/NavBar";
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

  // console.log(user);
  // console.log(error);
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
  // Reference leetcode UI
  // TODO Create Navbar
  // TODO Create a right sidebar (Similar to leetcode, a calender that tracks which days u have done questions, and some stats underneath)
  // TODO Create a getLoggedIn server action to retrieve all information about the signed in user. First get the uuid through supabase getUser, then retrieve the rest of the information ourselves
  return (
    <main className="font-open-sans">
      <NavBar user={user} />
      <div className="mt-18">{children}</div>
    </main>
  );
}
