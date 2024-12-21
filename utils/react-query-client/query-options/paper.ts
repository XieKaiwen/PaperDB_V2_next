// For query related to fetching papers for PaperTable with filters

import {
  countPapersWithFilters,
  getPaperDistinctValuesInColumns,
  getPapersWithFilters,
} from '@/src/actions/data-actions/paper.actions';
import { ParsedPaperFilterProps } from '@/src/types/types';
import { Prisma } from '@prisma/client';
import { keepPreviousData, queryOptions } from '@tanstack/react-query';

export function paperTableWithFiltersQueryOptions(
  {
    year,
    school,
    subject,
    examType,
    educationLevel,
    userId,
    fetchVisible,
    fetchNonVisible,
  }: ParsedPaperFilterProps,
  page: number,
  pageSize: number,
  includeFields: Prisma.PaperInclude = {},
  selectFields: Prisma.PaperSelect = {},
) {
  return queryOptions({
    queryKey: [
      'papers',
      'table',
      JSON.stringify({
        year,
        school,
        subject,
        examType,
        educationLevel,
        userId,
        fetchVisible,
        fetchNonVisible,
      } as ParsedPaperFilterProps),
      page,
      pageSize,
    ],
    queryFn: ({ queryKey }) => {
      const [, , filterString, page, pageSize] = queryKey as [
        string,
        string,
        string,
        number,
        number,
      ];
      const filters: ParsedPaperFilterProps = JSON.parse(filterString);
      console.log('Current paper filters: ', filters);

      return getPapersWithFilters({ ...filters }, page, pageSize, includeFields, selectFields);
    },
    placeholderData: keepPreviousData,
  });
}

export function paperTableCountWithFiltersQueryOptions(
  {
    year,
    school,
    subject,
    examType,
    educationLevel,
    userId,
    fetchVisible,
    fetchNonVisible,
  }: ParsedPaperFilterProps,
  pageSize: number,
) {
  return queryOptions({
    queryKey: [
      'papers',
      'table',
      'count',
      JSON.stringify({
        year,
        school,
        subject,
        examType,
        educationLevel,
        userId,
        fetchVisible,
        fetchNonVisible,
      } as ParsedPaperFilterProps),
      pageSize,
    ],
    queryFn: ({ queryKey }) => {
      const [, , , filterString, pageSize] = queryKey as [string, string, string, string, number];
      const filters: ParsedPaperFilterProps = JSON.parse(filterString);
      console.log('Current filters: ', filters);

      return countPapersWithFilters({ ...filters }, pageSize);
    },
  });
}

export function paperTableFilterDistinctValuesQueryOptions({
  includeVisible,
  includeNonVisible,
}: {
  includeVisible: boolean;
  includeNonVisible: boolean;
}) {
  return queryOptions({
    queryKey: ['papers', 'distinct', includeVisible, includeNonVisible],
    queryFn: ({ queryKey }) => {
      const [, , includeVisible, includeNonVisible] = queryKey as [
        string,
        string,
        boolean,
        boolean,
      ];
      return getPaperDistinctValuesInColumns({ includeVisible, includeNonVisible });
    },
  });
}
