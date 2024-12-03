import prisma from "@/utils/prisma-client/client";
import { createClient } from "@/utils/supabase/server";
import { UserRole } from "@prisma/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminLayout({
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
    const {id} = data.user
    const user = await prisma.user.getUserById(id)
    
    if (user!.role !== UserRole.ADMIN) {
        redirect("/home")
    }


  return (
    <section>
      {children}
    </section>
  );
}
