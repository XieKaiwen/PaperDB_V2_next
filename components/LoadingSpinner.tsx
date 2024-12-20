import { Loader2 } from "lucide-react";
import React from "react";

export default function LoadingSpinner({ size = "md" }: { size: string }) {
  const sizeClasses: Record<string, string> = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-white/90 fixed top-0 left-0 z-50">
      <Loader2 className={`${sizeClasses[size]} text-blue-500 animate-spin`} />
    </div>
  );
}
