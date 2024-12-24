'use client';
import React from 'react';
import PaperTableFilter from '@/components/PaperTable/PaperTableFilter';
import PaperTableContent from '@/components/PaperTable/PaperTableContent';
import PaperTablePagination from '@/components/PaperTable/PaperTablePagination';
import { useQuery } from '@tanstack/react-query';
import {
  paperTableCountWithFiltersQueryOptions,
  paperTableWithFiltersQueryOptions,
} from '@/utils/react-query-client/query-options/paper';
import { parsePaperSearchTablesParamsIntoFilters } from '@/utils/view-paper/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { paperTableFilterDistinctValuesQueryOptions } from '@/utils/react-query-client/query-options/paper';
import { AdminPaperDataForTable } from './types';
import { ParsedPaperFilterProps } from '@/src/types/types';
import { adminColumns } from './columns';

interface PaperTableProps {}

// To contain a pagination bar, the actual table and filtering bar

export default function AdminPaperTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // Define a helper function to get values with defaults
  const getParam = (key: string, defaultValue: string) => {
    const value = searchParams.get(key);
    return value !== null && value !== '' ? value : defaultValue;
  };

  const updateSearchParams = (key: string, value: string) => {
    // Create a URLSearchParams object from the current search params
    const params = new URLSearchParams(searchParams.toString());

    // Update the desired search param
    params.set(key, value);

    // Generate the new URL
    const newUrl = `${window.location.pathname}?${params.toString()}`;

    // Use router.push to navigate to the updated URL
    router.replace(newUrl);
  };

  // Retrieve search parameters with default values
  const year = getParam('year', '[]');
  const school = getParam('school', '[]');
  const subject = getParam('subject', '[]');
  const examType = getParam('examType', '[]');
  const edul = getParam('edul', '[]');
  const users = getParam('users', '[]');
  const page = getParam('page', '1');
  const pageSize = getParam('pageSize', '10');
  const visible = getParam('visible', 'true');
  const nonVisible = getParam('nonVisible', 'true');

  // Parse the search parameters into the correct forms
  const {
    edul: parsedEdul,
    year: parsedYear,
    school: parsedSchool,
    subject: parsedSubject,
    examType: parsedExamType,
    users: parsedUsers,
    fetchVisible: parsedFetchVisible,
    fetchNonVisible: parsedFetchNonVisible,
    page: parsedPage,
    pageSize: parsedPageSize,
  } = parsePaperSearchTablesParamsIntoFilters(
    {
      year,
      school,
      subject,
      examType,
      edul,
      users,
    },
    page,
    pageSize,
    visible,
    nonVisible,
  );

  const {
    isPending: isPaperCountPending,
    isError: isPaperCountError,
    data: paperCountData,
    error: paperCountError,
  } = useQuery(
    paperTableCountWithFiltersQueryOptions(
      {
        year: parsedYear,
        school: parsedSchool,
        subject: parsedSubject,
        examType: parsedExamType,
        educationLevel: parsedEdul,
        userId: parsedUsers,
        fetchVisible: parsedFetchVisible,
        fetchNonVisible: parsedFetchNonVisible,
      },
      parsedPageSize,
    ),
  );

  const {
    isPending: isPaperDataPending,
    isError: isPaperDataError,
    data: paperData,
    error: paperDataError,
    isPlaceholderData: isPlaceholderPaperData,
  } = useQuery(
    paperTableWithFiltersQueryOptions(
      {
        year: parsedYear,
        school: parsedSchool,
        subject: parsedSubject,
        examType: parsedExamType,
        educationLevel: parsedEdul,
        userId: parsedUsers,
        fetchVisible: parsedFetchVisible,
        fetchNonVisible: parsedFetchNonVisible,
      },
      parsedPage,
      parsedPageSize,
      {
        School: true,
        Subject: true,
        User: true,
      },
    ),
  );

  const {
    isPending: isPaperFilterValuesPending,
    isError: isFilterValuesError,
    data: filterValuesData,
    error: filterValuesError,
  } = useQuery(
    paperTableFilterDistinctValuesQueryOptions({
      includeNonVisible: parsedFetchNonVisible,
      includeVisible: parsedFetchVisible,
    }),
  );

  if (isPaperCountPending || isPaperDataPending || isPaperFilterValuesPending) {
    return <span>Loading...</span>;
  }

  if (isPaperCountError || isPaperDataError || isFilterValuesError) {
    return (
      <span>
        Error: {paperCountError?.message || paperDataError?.message || filterValuesError?.message}
      </span>
    );
  }

  const { totalCount: paperCount, totalPages: paperTotalPages } = paperCountData;
  if (parsedPage > paperTotalPages || parsedPage < 1) {
    updateSearchParams('page', '1'); // Default to the first page
  }

  const fullFilter: ParsedPaperFilterProps = {
    year: parsedYear,
    school: parsedSchool,
    subject: parsedSubject,
    examType: parsedExamType,
    educationLevel: parsedEdul,
    userId: parsedUsers,
    fetchVisible: parsedFetchVisible,
    fetchNonVisible: parsedFetchNonVisible,
  };

  return (
    <main className="paper-table space-y-4 px-4">
      <PaperTableFilter filterValues={filterValuesData} activeFilters={fullFilter} type="admin" />
      <PaperTableContent columns={adminColumns} data={paperData as AdminPaperDataForTable[]} />
      <PaperTablePagination
        totalPages={paperTotalPages}
        currentPage={parsedPage}
        isPlaceholder={isPlaceholderPaperData}
      />
    </main>
  );
}
