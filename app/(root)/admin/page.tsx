
import AddQuestionPage from '@/components/addQuestion/AddQuestionPage';
import React from 'react'

// TODO Create admin page, where people can add in papers and questions :D
// TODO Add enum role in users table to differentiate normal users and admins

export default function AdminPage() {
  return (
    <section id='adminPage'>
      <AddQuestionPage />
    </section>
  );
}
