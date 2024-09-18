import { getAllSubjects } from '@/actions/queryData.actions';
import AddQuestionPage from '@/components/addQuestion/AddQuestionPage';
import React from 'react'

// TODO Create admin page, where people can add in papers and questions :D
// TODO Add enum role in users table to differentiate normal users and admins
// TODO: Add retrieving topics, school and subjects from database. Then pass to AddQuestionPage

export default async function AdminPage() {
  const allSubjects = await getAllSubjects()
  // Fetch all the Get calls in parallel
  

  return (
    <section id='adminPage'>
      <AddQuestionPage />
    </section>
  );
}
