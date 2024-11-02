"use client";

import * as React from "react";
import Link from "next/link";
import NavLink from "./NavLink";
import { usePathname } from "next/navigation";
import MobileNav from "./MobileNav";
import { NavBarProps } from "@/src/types/types";
import { navRoutes as routes } from "@/src/constants/constants";

export default function NavBar({user} : NavBarProps) {
  const pathname = usePathname();
  return (
    <nav className="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="font-merriweather self-center text-2xl font-semibold whitespace-nowrap">
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
          {/* TODO implement mobile navbar for breakpoint up to md */}
          {/* <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button> */}
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
                  <NavLink key={link} title={title} link={link} isActive={isActive} />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
