import PaperTable from '@/components/PaperTable';
import { ParsedPaperFilterProps } from '@/src/types/types';
import { getQueryClient } from '@/utils/react-query-client/client';
import {
  paperTableCountWithFiltersQueryOptions,
  paperTableFilterDistinctValuesQueryOptions,
  paperTableWithFiltersQueryOptions,
} from '@/utils/react-query-client/query-options/paper';
import { createClient } from '@/utils/supabase/server';
import { parsePaperSearchTablesParamsIntoFilters } from '@/utils/view-paper/utils';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function AdminViewPaperPage({
  searchParams: {
    year = '[]',
    school = '[]',
    subject = '[]',
    examType = '[]',
    edul = '[]',
    users = '[]',
    page = '1',
    pageSize = '10',
    visible = 'true',
    nonVisible = 'true',
  },
}) {
  // Display Paper Table in default mode (just all papers for now), without any other features.
  // Other features like viewing pinned questions and assigned questions will be added on other routes
  /** Hence, we will be retrieving all papers here (pagination related data retrieval will be added later)
   * AKA. when we actually have enough papers to make a paginated table LOL
   * */
  // For admins, papers should not be limited to the school type (e.g. primary, secondary, JC). Maybe in the future can choose WHICH admin's paper i am looking at but no need for edu_level
  // For now, admins can see all papers, and hopefully afterwards be able to edit all questions
  // If searchParam is just an empty array, then take it as that for that param, there are no filters

  // Handling all the searchParameters
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
  // Getting the user id for future feature implementations (not yet)
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    redirect('/login');
  }
  // const userId = user?.id; // use in the future to get access to just a your papers, and maybe in the future can specifically see other admin's as well

  // TODO: use queryOptions to bundle together queryKey and queryFunctions for refactoring

  const queryClient = getQueryClient();
  // Prefetching the paginated paper data
  await queryClient.prefetchQuery(
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

  // Prefetch the number of papers for pagination (for total number of pages)
  await queryClient.prefetchQuery(
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

  // Prefetch data required for the filtering: year, school, subject, examType, edul, users
  // Only fetch distinct data that exists in the database
  await queryClient.prefetchQuery(
    paperTableFilterDistinctValuesQueryOptions({
      includeNonVisible: parsedFetchNonVisible,
      includeVisible: parsedFetchVisible,
    }),
  );

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
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PaperTable type="default" page={parsedPage} filters={fullFilter} />
    </HydrationBoundary>
  );
}
