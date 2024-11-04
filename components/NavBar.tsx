"use client";

import * as React from "react";
import Link from "next/link";
import NavLink from "./NavLink";
import { usePathname } from "next/navigation";
import MobileNav from "./MobileNav";
import { NavBarProps } from "@/src/types/types";
import { navRoutes as routes } from "@/src/constants/constants";

export default function NavBar({ user }: NavBarProps) {
  const pathname = usePathname();
  return (
    <nav className="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200">
      <div className=" flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="font-merriweather self-center tex#-2xl font-semibold whitespace-nowrap">
            PaperDB
          </span>
        </Link>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            type="button"
            className="text-white bg-lavender-500 hover:bg-lavender-700 focus:ring-4 focus:outline-none focus:ring-lavender-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center"
          >
            Placeholder
          </button>
          <MobileNav user={user} />
        </div>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
            {routes.map((route) => {
              const { title, link } = route;
              const isActive = pathname.startsWith(link);
              return (
                <li key={link}>
                  <NavLink
                    key={link}
                    title={title}
                    link={link}
                    isActive={isActive}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
