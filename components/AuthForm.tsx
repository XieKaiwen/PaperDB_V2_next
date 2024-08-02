"use client";
import React, { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { authFormSchema } from "@/lib/utils";
import CustomInput from "./CustomAuthInput";
import Link from "next/link";
import CustomSelect from "./CustomSelect";
import {redirect, useRouter, useSearchParams } from "next/navigation";
import { Oval } from "react-loader-spinner";
import { login, signUp } from "@/actions/user.actions";


export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams()
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
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
  const educationLevelOptions = {
    P1: "Primary 1",
    P2: "Primary 2",
    P3: "Primary 3",
    P4: "Primary 4",
    P5: "Primary 5",
    S1: "Secondary 1",
    S2: "Secondary 2",
    S3: "Secondary 3",
    S4: "Secondary 4",
    J1: "JC 1",
    J2: "JC 2",
  };
  // 2. Define a submit handler.
  async function onSubmit(data: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      // This will only be called if the form data is valid
      console.log("Form data:", data);
      setIsLoading(true)
      if(type === 'login'){
        const redirectedFrom = searchParams.get("redirectedFrom") || ""
        await login({...data, redirectedFrom: redirectedFrom})
      } else if(type === 'sign-up'){
        const signUpData = {
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword!,
          phoneNumber: data.phoneNumber!, 
          username: data.username!,
          educationLevel: data.educationLevel!,
        }
        // TODO Set up sign up flow. Still require testing of email verification process, redirection process and inserting into database, then querying the user data and passing it to the client
        await signUp(signUpData)
      }
      // Submit form data to your backend or handle it as needed
    } catch (error) {
      console.error("Validation failed:", error);
      // Handle validation errors, if any
    } finally{
      setIsLoading(false)
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
                  href="/login"
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
                  href="/sign-up"
                >
                  here
                </Link>
              </span>
            </p>
          )}
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    defaultValue="P1"
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
                className="w-full bg-lavender-400 hover:bg-lavender-500 text-gray-700"
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
