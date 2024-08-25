import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// TODO set up password reset (low priority)

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (data?.user) {
    redirect("/home");
  }
  // console.error(error);
  
  return (
    <>
      <main className="flex flex-row h-screen font-open-sans">
        {/* Left Section */}
        {children}
        {/* Right Section */}
        <div className="rounded-l-lg flex flex-col h-screen w-full sticky top-0 items-center justify-center max-lg:hidden bg-gradient-to-r from-lavender-300 to-sky-300 py-10">
          <div className="max-w-2xl 2xl:max-w-3xl flex flex-col gap-10">
            <h2 className="text-6xl 2xl:text-7xl font-bold text-gray-800 text-left font-merriweather">
              PaperDB
            </h2>
            {/* Auto generated text description. Placeholder */}
            <p className="text-lg 2xl:text-xl leading-relaxed text-gray-500 text-left">
              Welcome to PaperDB, a user-friendly platform designed to enhance
              learning for primary to junior college students. PaperDB makes
              studying easy and engaging with an intuitive interface for
              finding, reading, and annotating academic papers. It offers
              interactive highlights, note-taking tools, and personalized
              recommendations to improve comprehension and retention.
            </p>
          </div>
        </div>
      </main>
      <Toaster />
    </>
  );
}
