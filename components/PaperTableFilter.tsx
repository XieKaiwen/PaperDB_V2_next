import { edu_level, exam_type, School, Subject, User } from '@prisma/client'
import React from 'react'


interface PaperTableFilterProps{
  filterValues: {
    educationLevels: edu_level[];
    years: string[];
    examTypes: exam_type[];
    schools: School[];
    subjects: Subject[];
    users: User[]
  };
}
export default function PaperTableFilter({filterValues:
  {
    educationLevels,
    years,
    examTypes,
    schools,
    subjects,
    users
  }
}: PaperTableFilterProps) {
  console.log("Filter values: ", {
    educationLevels,
    years,
    examTypes,
    schools,
    subjects,
    users
  });
  
  return (
    <div>PaperTableFilter</div>
  )
}
