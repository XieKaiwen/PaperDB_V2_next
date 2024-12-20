'use client';

import React, { useEffect, useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import { useRouter, useSearchParams } from 'next/navigation';

interface PaperTablePaginationProps {
  totalPages: number;
  currentPage: number;
  isPlaceholder: boolean;
}

export default function PaperTablePagination({
  totalPages,
  currentPage,
  isPlaceholder,
}: PaperTablePaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set to true once the component is mounted on the client
  }, []);

  const constructURLWithPage = (page: number) => {
    if (!isClient) return '#'; // Ensure consistency during SSR
    if (page < 1 || page > totalPages) return '#'; // Prevent out-of-bounds navigation

    // Create a new URLSearchParams object to modify the query parameters
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString()); // Update the "page" parameter

    // Construct the full URL with the updated query parameters
    const newUrl = new URL(window.location.href); // Base URL
    newUrl.search = params.toString(); // Update the query string

    return newUrl.toString();
  };

  // Avoid rendering until client-side rendering is available
  if (!isClient) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={constructURLWithPage(currentPage - 1)}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }).map((_, index) => (
          <PaginationItem key={index + 1}>
            <PaginationLink
              href={constructURLWithPage(index + 1)}
              isActive={index + 1 === currentPage}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href={constructURLWithPage(currentPage + 1)}
            className={
              isPlaceholder || currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
