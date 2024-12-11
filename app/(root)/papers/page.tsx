import PaperTable from "@/components/PaperTable";
import { getPapersWithFilters } from "@/src/actions/data-actions/paper.actions";
import { eduLevelMapToSchoolType, schoolTypeMapToEduLevel } from "@/src/constants/constants";
import { getQueryClient } from "@/utils/react-query-client/client";
import { createClient } from "@/utils/supabase/server";
import { edu_level, exam_type } from "@prisma/client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import React from "react";

interface PapersPageSearchParams{
  year: "all" | string[]
  school: "all" | string[],
  subject: "all" | string[],
  examType: "all" | exam_type[];
}

export default async function Papers({ searchParams:{year = "all", school = "all", subject = "all", examType = "all"} }) {
  const queryClient = getQueryClient();

  // Display Paper Table in default mode (just all papers for now), without any other features.
  // Other features like viewing pinned questions and assigned questions will be added on other routes
  /** Hence, we will be retrieving all papers here (pagination related data retrieval will be added later)
   * AKA. when we actually have enough papers to make a paginated table LOL
   * */
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }
  const edul = user?.user_metadata?.educationLevel as edu_level;
  const userSchoolType = eduLevelMapToSchoolType[edul];
  const edulList = schoolTypeMapToEduLevel[userSchoolType];
  
  await queryClient.prefetchQuery({
    queryKey: ["papers", JSON.stringify({year, school, subject, examType})],
    queryFn: ({queryKey}) => {
      const [, filterString] = queryKey;
      const filters = JSON.parse(filterString) as PapersPageSearchParams 
      return getPapersWithFilters({...filters, educationLevel: [edul]});
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PaperTable type="default"/>
    </HydrationBoundary>
  );
}
