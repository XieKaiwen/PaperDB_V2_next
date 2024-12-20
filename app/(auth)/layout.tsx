import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

// TODO set up password reset (low priority)

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    redirect('/home');
  }
  // console.error(error);

  return (
    <>
      <main className="flex h-screen flex-row font-open-sans">
        {/* Left Section */}
        {children}
        {/* Right Section */}
        <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center rounded-l-lg bg-gradient-to-r from-lavender-300 to-sky-300 py-10 max-lg:hidden">
          <div className="flex max-w-2xl flex-col gap-10 2xl:max-w-3xl">
            <h2 className="text-left font-merriweather text-6xl font-bold text-gray-800 2xl:text-7xl">
              PaperDB
            </h2>
            {/* Auto generated text description. Placeholder */}
            <p className="text-left text-lg leading-relaxed text-gray-500 2xl:text-xl">
              Welcome to PaperDB, a user-friendly platform designed to enhance learning for primary
              to junior college students. PaperDB makes studying easy and engaging with an intuitive
              interface for finding, reading, and annotating academic papers. It offers interactive
              highlights, note-taking tools, and personalized recommendations to improve
              comprehension and retention.
            </p>
          </div>
        </div>
      </main>
      <Toaster />
    </>
  );
}
