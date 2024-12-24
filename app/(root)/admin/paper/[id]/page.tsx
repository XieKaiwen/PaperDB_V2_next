import React from 'react';

export default async function AdminPaperPage({ params }: { params: { id: string } }) {
  const paperId = params.id;
  return <div>Page for paper {paperId}</div>;
}
