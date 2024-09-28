import {
  getAllSchools,
  getAllSubjects,
  getAllTopics,
} from "@/actions/queryData.actions";
import AddQuestionPage from "@/components/addQuestion/AddQuestionPage";
import { getQueryClient } from "@/utils/react-query-client/client";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

// TODO Create admin page, where people can add in papers and questions :D
// TODO Add enum role in users table to differentiate normal users and admins
// TODO: Add retrieving topics, school and subjects from database. Then pass to AddQuestionPage

export default async function AdminPage() {
  // TOD Change fetching of data to using react-query instead
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: ["subjects"],
    queryFn: getAllSubjects,
  });
  queryClient.prefetchQuery({
    queryKey: ["topics"],
    queryFn: getAllTopics,
  });
  queryClient.prefetchQuery({
    queryKey: ["schools"],
    queryFn: getAllSchools,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section id="admin-page" 
        // className=" h-screen"
      >
        <AddQuestionPage />
      </section>
    </HydrationBoundary>
  );
}
