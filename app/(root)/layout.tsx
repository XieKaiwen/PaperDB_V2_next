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
    if(error){
      console.error(error);
    }

    const headerList = headers();
    const redirectFrom = headerList.get("x-current-path");
    
    if (redirectFrom) {
      const encodedRedirectFrom = encodeURIComponent(redirectFrom);
      redirect(`/login?redirectedFrom=${encodedRedirectFrom}`);
    } else {
      redirect("/login");
    }
  }

  return (
    <>
      <p>{data.user.email}</p>
      {children}
    </>
  );
}