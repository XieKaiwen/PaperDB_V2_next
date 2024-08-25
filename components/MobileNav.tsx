import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import NavLink from "./NavLink";
import { Separator } from "./ui/separator";

const routes = [
  { title: "Home", link: "/home" },
  { title: "Contact Us", link: "/contact-us" },
  { title: "Papers", link: "/papers" },
];

export default function MobileNav({user} : MobileNavProps) {
  const pathname = usePathname();
  return (
    <div className="inline-flex items-center  p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
      <Sheet>
        <SheetTrigger>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </SheetTrigger>
        <SheetContent className="border-none bg-white font-open-sans">
          <SheetHeader className=" mb-2">
            <SheetTitle>Hello {user.username}!</SheetTitle>
            <SheetDescription>
            Sed et malesuada ante. Suspendisse ut est in nisi porta volutpat. Donec euismod mi at ex eleifend, eget faucibus orci vulputate.
            </SheetDescription>
          </SheetHeader>
          <Separator />
          <SheetClose asChild>
            <nav className="flex h-full flex-col gap-6 pt-6 text-black font-open-sans">
              {routes.map((route) => {
                const isActive =
                  pathname === route.link ||
                  pathname.startsWith(`${route.link}`);
                return (
                  <SheetClose asChild key={route.link}>
                    {/* <Link
                      href={route.link}
                      key={route.title}
                      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 "
                    >
                      <p>{route.title}</p>
                    </Link> */}
                    <NavLink title={route.title} link={route.link} isActive = {isActive} />
                  </SheetClose>
                );
              })}
            </nav>
          </SheetClose>
        </SheetContent>
      </Sheet>
    </div>
  );
}
