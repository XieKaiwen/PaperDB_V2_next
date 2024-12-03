import { buttonVariants } from '@/components/ui/button'
import { adminActions } from '@/src/constants/constants'
import Link from 'next/link'
import React from 'react'

export default function AdminPage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-white shadow-md rounded-lg max-w-xl w-full">
        {adminActions.map((action) => {
            const {title, link} = action
            return (
                <Link key={title} className={buttonVariants({variant: 'default'})} href={link}>
                    {title}
                </Link>
            )
        })}
    </div>
  )
}
