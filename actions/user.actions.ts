"use server";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function login({ email, password, redirectedFrom="" }: LoginProps) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error(error);    
    throw new Error(error.message);
  }
  redirect(`/${redirectedFrom || "home"}`)
}

export async function signUp({
  email,
  password,
  phoneNumber,
  username,
  educationLevel,
  redirectedFrom=""
}: SignUpProps) {
    const headersList = headers()
    const host = headersList.get('host')
    const protocol = headersList.get('x-forwarded-proto') || 'http'
    
    const origin = `${protocol}://${host}`
    
    // Use the origin as needed
    console.log('Request origin:', origin)
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        phoneNumber: phoneNumber,
        username: username,
        educationLevel: educationLevel,
      },
      emailRedirectTo: `${origin}/auth/?redirectedFrom=${redirectedFrom}`
    },
  });

  if (error) {
    console.error(error);
    throw new Error("Something wrong happened");
  }

  redirect("/home");
}
