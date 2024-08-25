"use server";
import { parseStringify } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { PrismaClient } from "@prisma/client";
import { redirect, RedirectType } from "next/navigation";

const prisma = new PrismaClient();

export async function login({ email, password }: LoginProps) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs

  try {
    const { data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    const user = data?.user;
    console.log("Retrieved user: ", user);
    return parseStringify(user);
  } catch (error) {
    console.error(error);
  }
}

export async function signUp({
  email,
  password,
  phoneNumber,
  username,
  educationLevel,
  redirectedFrom,
}: SignUpProps) {
  // Because we have confirm email (email verification) on, supabase signUp function will return a fake user object even if the email already exists. Have to check if the email is already in use manually
  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (existingUser) {
    const encodedError = encodeURIComponent(
      "Email already in use. Sign up with another email"
    );
    return redirect(
      `/sign-up?error=${encodedError}${
        redirectedFrom
          ? `&redirectedFrom=${encodeURIComponent(redirectedFrom)}`
          : ""
      }`,
      RedirectType.replace
    );
  }

  const headersList = headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";

  const origin = `${protocol}://${host}`;

  // Use the origin as needed
  console.log("Request origin:", origin);
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
      emailRedirectTo: `${origin}/auth/callback?${
        redirectedFrom ? `redirectedFrom=${redirectedFrom}` : ""
      }`,
    },
  });

  const user = data?.user;
  console.log("Created user: ", user);
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return parseStringify(user);
}
// "$2a$10$etyWU/wN2xz1QCFlEGSvquE.QWMRMAnrcgBBcTBLYMWOGvlpJYQN6"

export async function getLoggedInUser(): Promise<GetLoggedInResponse> {
  // First get the basic information (user id) from supabase and then retrieve the rest of the information
  // Try to follow the {data, error} format, but instead of sending over generic data, we will sendover a user object with all the information
  const response: {
    user: {
      id: string;
      email: string;
      dateJoined: Date;
      educationLevel: string;
      phoneNumber: string;
      username: string;
    } | null;
    error: boolean;
  } = {
    user: null,
    error: false,
  };
  const supabase = createClient();
  try {
    const { data } = await supabase.auth.getUser();
    if (!data?.user) {
      return parseStringify(response);
    }
    const userId = data.user.id;
    try {
      const retrievedUser = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      response.user = retrievedUser;
      return parseStringify(response);
    } catch (error) {
      console.error(error);
      response.error = true;
      return parseStringify(response);
    }
  } catch (error) {
    console.error(error);
    response.error = true;
    return parseStringify(response);
  }
}
