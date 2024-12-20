import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

// Admin actions
export const adminActions = [
  {
    title: 'Add question',
    link: '/admin/add-question',
  },
  {
    title: 'View papers',
    link: '/admin/paper',
  },
];

export default function AdminPage() {
  return (
    <div className="grid w-full max-w-xl grid-cols-1 gap-4 rounded-lg bg-white p-4 shadow-md sm:grid-cols-2 md:grid-cols-3">
      {adminActions.map((action) => {
        const { title, link } = action;
        return (
          <Link key={title} className={buttonVariants({ variant: 'default' })} href={link}>
            {title}
          </Link>
        );
      })}
    </div>
  );
}
