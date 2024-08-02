import AuthForm from "@/components/AuthForm";
import React from "react"

export default function Login() {
  return (
    <div className="w-full lg:w-3/5 flex align items-center justify-center">
      <div>
        <AuthForm type="login" />
      </div>
    </div>
  );
}
