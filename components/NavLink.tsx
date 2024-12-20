import { NavLinkProps } from '@/src/types/types';
import { cn } from '@/utils/utils';
import Link from 'next/link';
import React from 'react';

export default function NavLink({ title, link, isActive = false, className = '' }: NavLinkProps) {
  return (
    <Link
      href={link}
      className={cn(
        'block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-sky-800',
        className,
        {
          'bg-sky-200 font-semibold md:bg-transparent md:font-bold md:text-sky-800': isActive,
        },
      )}
    >
      {title}
    </Link>
  );
}
