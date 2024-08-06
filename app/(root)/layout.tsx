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

  try {
    
    const { data } = await supabase.auth.getUser();
    if (!data?.user) {
      throw new Error("User not found");
    }


    return (
      <>
        <p>{data.user.email}</p>
        {children}
      </>
    );









  } catch (error) {
    console.error(error);
    const headerList = headers();
    const redirectFrom = headerList.get("x-current-path");
    
    if (redirectFrom) {
      const encodedRedirectFrom = encodeURIComponent(redirectFrom);
      redirect(`/login?redirectFrom=${encodedRedirectFrom}`);
    } else {
      redirect("/login");
    }
  }
}
