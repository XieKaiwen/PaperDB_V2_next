import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

export default function NavLink({
  title,
  link,
  isActive = false,
  className = "",
}: NavLinkProps) {
  return (
    <Link
      href={link}
      className={cn(
        "block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-sky-800 md:p-0",
        className,
        {
            "md:text-sky-800 bg-sky-200 md:bg-transparent md:font-bold font-semibold" : isActive
        }
      )}
    >
      {title}
    </Link>
  );
}
