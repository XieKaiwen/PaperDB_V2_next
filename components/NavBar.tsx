'use client';

import * as React from 'react';
import Link from 'next/link';
import NavLink from './NavLink';
import { usePathname } from 'next/navigation';
import MobileNav from './MobileNav';
import { NavBarProps } from '@/src/types/types';
import { navRoutes as routes } from '@/src/constants/constants';

export default function NavBar({ user }: NavBarProps) {
  const pathname = usePathname();
  return (
    <nav className="fixed start-0 top-0 z-20 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex flex-wrap items-center justify-between p-4">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="tex#-2xl self-center whitespace-nowrap font-merriweather font-semibold">
            PaperDB
          </span>
        </Link>
        <div className="flex space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
          <button
            type="button"
            className="rounded-lg bg-lavender-500 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-lavender-700 focus:outline-none focus:ring-4 focus:ring-lavender-300"
          >
            Placeholder
          </button>
          <MobileNav user={user} />
        </div>
        <div
          className="hidden w-full items-center justify-between md:order-1 md:flex md:w-auto"
          id="navbar-sticky"
        >
          <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 rtl:space-x-reverse">
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
