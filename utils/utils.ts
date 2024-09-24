import { type ClassValue, clsx } from "clsx";
import { NextRequest } from "next/server";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const authFormSchema = (type: string) =>
  z
    .object({
      email: z.string().email({ message: "Invalid email address" }),
      password:
        type === "login"
          ? z.string().min(1, { message: "Password is required" })
          : z.string().min(8, {
              message: "Password must be at least 8 characters long",
            }),
      confirmPassword: type === "login" ? z.string().optional() : z.string(),
      phoneNumber:
        type === "login"
          ? z.string().optional()
          : z.string().regex(/^\+?[1-9]\d{0,2}(?:\s?\d{1,4}){1,5}$/, {
              message: "Invalid phone number",
            }),
      username:
        type === "login"
          ? z.string().optional()
          : z
              .string()
              .min(3, {
                message: "Username must be at least 3 characters long",
              })
              .max(50, {
                message: "Username must be less than 50 characters long",
              }),
      educationLevel:
        type === "login"
          ? z.string().optional()
          : z
              .string()
              .min(2, { message: "Please select a valid level of education" }),
    })
    .refine(
      (data) => {
        if (type !== "login") {
          return data.password === data.confirmPassword;
        }
        return true; // No confirmPassword check for login type
      },
      {
        message: "Passwords do not match",
        path: ["confirmPassword"], // Path to indicate where the error occurs
      }
    );

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));


// TODO fix the parseMapString function because currently the output of it is wrong:
/* 
E.g.
metadata string is 'map[educationLevel:P2 email:xiekaiwen3@gmail.com email_verified:false phoneNumber: 65 96305601 phone_verified:false sub:b3b4ac94-7e3a-4bf8-b198-349ea5ad6b95 username:Kaiwen]'
but the metadataObject output is 
{
  educationLevel: 'P2',
  email: 'xiekaiwen3@gmail.com',
  email_verified: false,
  phoneNumber: '65',
  phone_verified: false,
  sub: 'b3b4ac94-7e3a-4bf8-b198-349ea5ad6b95',
  username: 'Kaiwen'
}
It doesnt deal with the spaces correctly

Edit: Do not need this anymore because the response from verifyOtp already returns the correct metadata object
*/

export function getBaseUrl(request: NextRequest): string {
  // Check if we have a base URL defined in the environment
  const envBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (envBaseUrl) {
    return envBaseUrl;
  }

  // Fallback to constructing from the request
  const host = request.headers.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export function generateYearList(){
  const currentYear = new Date().getFullYear();
  const years = [];
  for(let i = currentYear; i >= 2000; i--){
    years.push({value: `${i}`, label: `${i}`});
  }
  return years;
}


export function generateOptionsFromJsonList(JSONList: Record<string, any>[], valueKey: string, labelKey: string): {value: string; label: string}[] {
  const optionsList = JSONList.map((item) => {
    return {value: item[valueKey], label: item[labelKey]}
  })

  return optionsList
}