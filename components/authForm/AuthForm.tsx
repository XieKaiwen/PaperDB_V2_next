"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { authFormSchema } from "@/utils/utils";
import CustomInput from "./CustomAuthInput";
import Link from "next/link";
import CustomSelect from "./CustomAuthSelect";
import { useRouter, useSearchParams } from "next/navigation";
import { Oval } from "react-loader-spinner";
import { login, signUp } from "@/actions/user.actions";
import { useToast } from "../ui/use-toast";
import { educationLevelOptions } from "@/src/constants/constants";
import { AuthFormProps } from "@/src/types/types";
// TODO Add in Oauth buttons below the forms using shadcn separator
// TODO Add in reset password for "Forgot password" feature

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [sentEmail, setSentEmail] = useState(false);
  const [displayedError, setDisplayedError] = useState(false);

  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    if (searchParams.get("error") && !displayedError) {
      const error = searchParams.get("error")!;
      const decodedError = decodeURIComponent(error);
      setTimeout(() => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: decodedError,
        });
        setDisplayedError(true);
      }, 100);
    }
  }, [toast, searchParams, displayedError]);

  useEffect(() => {
    if (sentEmail) {
      setTimeout(() => {
        toast({
          title: "Email sent for verification",
          description:
            "Please click the link sent to your email to complete the sign up process.",
        });
      }, 100);
    }
  }, [toast, sentEmail]);

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(type === "sign-up" && {
        confirmPassword: "",
        phoneNumber: "",
        username: "",
        educationLevel: "",
      }),
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      // This will only be called if the form data is valid
      console.log("Form data:", data);
      setIsLoading(true);
      const redirectedFrom = searchParams.get("redirectedFrom") || "";
      if (type === "login") {
        try {
          const response = await login({ ...data });
          if (response) {
            router.replace(redirectedFrom);
          }
          setDisplayedError(false);
          const encodedError = encodeURIComponent(
            "User not found, incorrect email or password"
          );
          router.replace(
            `/login?error=${encodedError}${
              redirectedFrom
                ? `&redirectedFrom=${encodeURIComponent(redirectedFrom)}`
                : ""
            }`
          );
        } catch (error) {
          setDisplayedError(false);
          console.error(error);
          const encodedError = encodeURIComponent(
            "Error occurred during login process"
          );
          router.replace(
            `/login?error=${encodedError}${
              redirectedFrom
                ? `&redirectedFrom=${encodeURIComponent(redirectedFrom)}`
                : ""
            }`
          );
        }
      } else if (type === "sign-up") {
        setSentEmail(false);
        const signUpData = {
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword!,
          phoneNumber: data.phoneNumber!,
          username: data.username!,
          educationLevel: data.educationLevel!,
        };
        try {
          const response = await signUp({ ...signUpData, redirectedFrom });
          if (response) {
            form.reset();
            setSentEmail(true);
          }
          setDisplayedError(false);
        } catch (error) {
          setDisplayedError(false);
          console.error(error);
          const encodedError = encodeURIComponent(
            "Error occurred in sign up process"
          );
          router.replace(
            `/sign-up?error=${encodedError}${
              redirectedFrom
                ? `&redirectedFrom=${encodeURIComponent(redirectedFrom)}`
                : ""
            }`
          );
        }
      }
      // Submit form data to your backend or handle it as needed
    } catch (error) {
      console.error("Validation failed:", error);
      // Handle validation errors, if any
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <section className="p-10">
      <div className="flex flex-col gap-5">
        <div className="min-w-72">
          <h1 className="font-merriweather font-bold text-4xl 2xl:text-5xl">
            {type === "sign-up" ? "Sign up" : "Login"}
          </h1>
          {type === "sign-up" ? (
            <p className="text-sm mt-1.5">
              Already have an account?{" "}
              <span>
                Login{" "}
                <Link
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  href={`/login${
                    searchParams.get("redirectedFrom")
                      ? `?redirectedFrom=${encodeURIComponent(
                          searchParams.get("redirectedFrom")!
                        )}`
                      : ""
                  }`}
                >
                  here
                </Link>
              </span>
            </p>
          ) : (
            <p className="text-sm mt-1.5">
              Don't have an account?{" "}
              <span>
                Sign up{" "}
                <Link
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  href={`/sign-up${
                    searchParams.get("redirectedFrom")
                      ? `?redirectedFrom=${encodeURIComponent(
                          searchParams.get("redirectedFrom")!
                        )}`
                      : ""
                  }`}
                >
                  here
                </Link>
              </span>
            </p>
          )}
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="username"
                      label="Username"
                      placeholder="Enter your username"
                    />
                    <CustomInput
                      control={form.control}
                      name="phoneNumber"
                      label="Phone no."
                      placeholder="E.g. +65 XXXX XXXX"
                    />
                  </div>
                  <CustomSelect
                    control={form.control}
                    name="educationLevel"
                    placeholder="Select your education level"
                    label="Education level"
                    selectOptions={educationLevelOptions}
                  />
                </>
              )}
              <CustomInput
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter your email"
              />
              <CustomInput
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter your password"
              />

              {type === "sign-up" && (
                <CustomInput
                  control={form.control}
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="Re-enter your password"
                />
              )}

              <Button
                type="submit"
                className="w-full bg-lavender-300 hover:bg-lavender-400 text-gray-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex gap-4">
                    <p className="">Loading</p>
                    <Oval
                      visible={true}
                      height="20"
                      width="20"
                      color="#a3c4ff"
                      ariaLabel="oval-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  </div>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
          {type === "sign-up" && (
            <p className="text-gray-500 text-xs mt-1">
              * All fields are required
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
