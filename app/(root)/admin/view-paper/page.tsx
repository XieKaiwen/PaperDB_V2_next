import PaperTable from "@/components/PaperTable";
import { getPapersWithFilters } from "@/src/actions/data-actions/paper.actions";
import {
  UnparsedPaperFilterProps,
  ParsedPaperFilterProps,
} from "@/src/types/types";
import { getQueryClient } from "@/utils/react-query-client/client";
import { createClient } from "@/utils/supabase/server";
import { parseViewPaperSearchParamsIntoFilters } from "@/utils/view-paper/utils";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminViewPaperPage({
  searchParams: {
    year = "[]",
    school = "[]",
    subject = "[]",
    examType = "[]",
    edul = "[]",
    page = "1",
    pageSize = "10",
    onlyVisible = "false",
    onlyNonVisible = "false",
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
  const parsedPage = isNaN(parseInt(page)) ? 1 : parseInt(page);
  const parsedPageSize = isNaN(parseInt(pageSize)) ? 1 : parseInt(pageSize);
  const {
    edul: parsedEdul,
    year: parsedYear,
    school: parsedSchool,
    subject: parsedSubject,
    examType: parsedExamType,
  } = parseViewPaperSearchParamsIntoFilters({
    year,
    school,
    subject,
    examType,
    edul,
  });
  const parsedOnlyVisible = onlyVisible === "true" ? true : false;
  const parsedOnlyNonVisible = onlyNonVisible === "true" ? true : false;
  // Getting the user id for future feature implementations (not yet)
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/login");
  }
  const userId = user?.id; // use in the future to get access to just a your papers, and maybe in the future can specifically see other admin's as well

  const queryClient = getQueryClient();
  // Prefetching the paginated
  await queryClient.prefetchQuery({
    queryKey: [
      "papers",
      JSON.stringify({
        year: parsedYear,
        school: parsedSchool,
        subject: parsedSubject,
        examType: parsedExamType,
        educationLevel: parsedEdul,
        onlyVisible: parsedOnlyVisible,
        onlyNonVisible: parsedOnlyNonVisible,
      } as ParsedPaperFilterProps),
      parsedPage,
      parsedPageSize,
    ],
    queryFn: ({ queryKey }) => {
      const [, filterString, page, pageSize] = queryKey as [
        string,
        string,
        number,
        number
      ];
      const filters: ParsedPaperFilterProps = JSON.parse(filterString);
      console.log("Current filters: ", filters);
      
      return getPapersWithFilters({ ...filters }, page, pageSize, {
        School: true,
        Subject: true,
        User: true
      });
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PaperTable type="default" />
    </HydrationBoundary>
  );
}
