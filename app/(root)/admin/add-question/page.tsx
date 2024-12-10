import {
  getAllSchools,
  getAllSubjects,
  getAllTopics,
} from "@/src/actions/dataFetching.actions";
import AddQuestionPage from "@/components/addQuestionPage/AddQuestionPage";
import { getQueryClient } from "@/utils/react-query-client/client";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

// TODO Create admin page, where people can add in papers and questions :D
// TODO Add enum role in users table to differentiate normal users and admins


export default async function AdminAddQuestionPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["subjects"],
    queryFn: getAllSubjects
  });
  await queryClient.prefetchQuery({
    queryKey: ["topics"],
    queryFn: getAllTopics,
  });
  await queryClient.prefetchQuery({
    queryKey: ["schools"],
    queryFn: getAllSchools,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section id="admin-page" 
        // className=" h-screen"
        className=""
      >
        <AddQuestionPage />
      </section>
    </HydrationBoundary>
  );
}
