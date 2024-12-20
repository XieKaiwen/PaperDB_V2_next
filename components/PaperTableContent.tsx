import { Paper, School, Subject, User } from '@prisma/client'
import React from 'react'

interface PaperTableContent{
  data: (Paper & {
    School: School;
    Subject: Subject;
    User: User;
  })[]
}
export default function PaperTableContent({data}:PaperTableContent) {
  console.log("Table data: ", data);
  
  return (
    <div>PaperTableContent</div>
  )
}
