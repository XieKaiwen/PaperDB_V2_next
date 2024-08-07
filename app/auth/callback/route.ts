import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { getBaseUrl } from "@/lib/utils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  console.log(request.url);
  console.log(searchParams);

  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const next = searchParams.get("redirectedFrom") ?? "/home";
  const decodedNext = decodeURIComponent(next)

  const metadata = searchParams.get("metadata") || "";

  console.log("metadata: ", metadata);
  console.log("next: ", next);

  console.log("token_hash: ", token_hash);
  console.log("type: ", type);

  const baseURL = getBaseUrl(request);
  if (token_hash && type) {
    const supabase = createClient();
    try {
      const response = await supabase.auth.verifyOtp({ type, token_hash });
      console.log(response);
      console.log(response.data.user?.user_metadata); // This contains all the relevant information that I need to store in the database, dont need to parse the metadata string
      const userData = response.data.user?.user_metadata;
      if (!userData) {
        throw new Error("userData not defined. Metadata missing");
      }
      /*
      {
        educationLevel: 'P3',
        email: 'xiekaiwen3@gmail.com',
        email_verified: false,
        phoneNumber: '+65 96305601',
        phone_verified: false,
        sub: 'acf47eef-8998-4473-9eb8-6a76b3e85e37',
        username: 'Xie Kaiwen'
        ^User data
      }
      */
      try {
        // Insert user into database
        // const newUser = await prisma.user.create({
        //   data:{
        //     email: "example@example.com",
        //     dateJoined: new Date("2024-08-04"),
        //     educationLevel: "Bachelor",
        //     phoneNumber: "123-456-7890",
        //     username: "exampleuser",
        //   },
        // });
        const newUser = await prisma.user.create({
          data: {
            id: userData.sub,
            email: userData.email,
            educationLevel: userData.educationLevel,
            phoneNumber: userData.phoneNumber,
            username: userData.username,
          },
        });

        try {
          // Insert sign up log into the userLog table
          // TODO implement rolling back of updates in the database, to prevent further errors from occurring due to "User exists in database"
          const newUserLog = await prisma.userLog.create({
            data: {
              userId: newUser.id,
              logInfo: `${newUser.username} just successfully registered and verified his email (${newUser.email})`,
            },
          });
          console.log(newUserLog);

          return NextResponse.redirect(new URL(decodedNext, baseURL));
        } catch (error) {
          console.error(error);
          const encodedError = encodeURIComponent(
            "An error occurred during email verification"
          );
          return NextResponse.redirect(
            new URL(`/sign-up?error=${encodedError}${decodedNext ? `&redirectedFrom=${encodeURIComponent(decodedNext)}` : ""}`, baseURL)
          );
        }
      } catch (error) {
        console.error(error);
        const encodedError = encodeURIComponent(
          "An error occurred during email verification"
        );
        return NextResponse.redirect(
          new URL(`/sign-up?error=${encodedError}${decodedNext ? `&redirectedFrom=${encodeURIComponent(decodedNext)}` : ""}`, baseURL)
        );
      }
    } catch (err) {
      console.error(err);
      const encodedError = encodeURIComponent(
        "An error occurred during email verification"
      );
      return NextResponse.redirect(
        new URL(`/sign-up?error=${encodedError}${decodedNext ? `&redirectedFrom=${encodeURIComponent(decodedNext)}` : ""}`, baseURL)
      );
    }
  } else {
    console.error("Token_hash or Type missing");
    const encodedError = encodeURIComponent(
      "An error occurred during email verification"
    );
    return NextResponse.redirect(
      new URL(`/sign-up?error=${encodedError}${decodedNext ? `&redirectedFrom=${encodeURIComponent(decodedNext)}` : ""}`, baseURL)
    );
  }
}
