import { generateOptionsFromJsonList } from "@/utils/utils";
import { edu_level, exam_type, School, Subject, User } from "@prisma/client";
import React, { useMemo, useState } from "react";
import PopoverMultipleCheckbox from "../PopoverMultipleCheckbox";
import { Button } from "../ui/button";

interface PaperTableFilterProps {
  filterValues: {
    educationLevels: edu_level[];
    years: string[];
    examTypes: exam_type[];
    schools: School[];
    subjects: Subject[];
    users: User[];
  };
  activeFilters: {
    educationLevel: string[];
    year: string[];
    examType: string[];
    school: string[];
    subject: string[];
    userId: string[];
    fetchVisible: boolean;
    fetchNonVisible: boolean;
  };
  type: "admin" | "default";
}
export default function PaperTableFilter({
  filterValues: {
    educationLevels: educationLevelsFilterValues,
    years: yearsFilterValues,
    examTypes: examTypesFilterValues,
    schools: schoolsFilterValues,
    subjects: subjectsFilterValues,
    users: usersFilterValues,
  },
  activeFilters: {
    educationLevel: activeEducationLevels,
    year: activeYears,
    examType: activeExamTypes,
    school: activeSchools,
    subject: activeSubjects,
    userId: activeUserIds,
    fetchVisible = true,
    fetchNonVisible = false
  },
  type = "default"
}: PaperTableFilterProps) {
  console.log("Filter values: ", {
    educationLevelsFilterValues,
    yearsFilterValues,
    examTypesFilterValues,
    schoolsFilterValues,
    subjectsFilterValues,
    usersFilterValues,
  });
  console.log("Filters from search params: ", {
    activeEducationLevels,
    activeYears,
    activeExamTypes,
    activeSchools,
    activeSubjects,
    activeUserIds,
  });
  // Generate the options from the filter values
  const educationLevelOptions = useMemo(() => {
    const optionsList = educationLevelsFilterValues.map((level) => {
      return { value: level, label: level };
    })
    return optionsList
  }, [educationLevelsFilterValues])
  const yearOptions = useMemo(() => {
    const optionsList = yearsFilterValues.map((year) => {
      return { value: year, label: year };
    })
    return optionsList
  }, [yearsFilterValues])
  const examTypeOptions = useMemo(() => {
    const optionsList = examTypesFilterValues.map((type) => {
      return { value: type, label: type };
    })
    return optionsList
  }, [examTypesFilterValues]);
  const schoolOptions = useMemo(() => {
    const optionsList = generateOptionsFromJsonList(schoolsFilterValues, "id", "schoolFullName")
    return optionsList
  }, [schoolsFilterValues])
  const subjectOptions = useMemo(() => {
    const optionsList = generateOptionsFromJsonList(subjectsFilterValues, "id", "subjectName")
    return optionsList
  }, [subjectsFilterValues])
  const userOptions = useMemo(() => {
    const optionsList = generateOptionsFromJsonList(usersFilterValues, "id", "email")
    return optionsList
  }, [usersFilterValues]);
  
  const [educationLevels, setEducationLevels] = useState<string[]>(
    activeEducationLevels.filter((level) =>
      educationLevelsFilterValues.includes(level as edu_level)
    )
  );
  const [years, setYears] = useState<string[]>(
    activeYears.filter((year) => yearsFilterValues.includes(year))
  );
  const [examTypes, setExamTypes] = useState<string[]>(
    activeExamTypes.filter((type) =>
      examTypesFilterValues.includes(type as exam_type)
    )
  );
  const [schools, setSchools] = useState<string[]>(
    activeSchools.filter((school) =>
      schoolsFilterValues.some((s) => s.id === school)
    )
  );
  const [subjects, setSubjects] = useState<string[]>(
    activeSubjects.filter((subject) =>
      subjectsFilterValues.some((s) => s.id === subject)
    )
  );
  const [users, setUsers] = useState<string[]>(
    activeUserIds.filter((userId) =>
      usersFilterValues.some((u) => u.id === userId)
    )
  );
  const [includeVisible, setIncludeVisible] = useState(fetchVisible);
  const [includeNonVisible, setIncludeNonVisible] = useState(fetchNonVisible);



  const handleApplyFilters = () => {
    // Implement the logic you want to perform when filters are applied.
    // You can access all selected arrays here.
    console.log("Filters applied with:", {
      educationLevels,
      years,
      examTypes,
      schools,
      subjects,
      users,
      includeVisible,
      includeNonVisible
    });
  };


  return (
    <div className="p-4 space-y-4 border border-slate-400">
      <h2 className="text-2xl font-semibold underline underline-offset-2">Filter papers</h2>
      <div className="flex flex-wrap gap-12">
        <PopoverMultipleCheckbox
          label="Education Level"
          options={educationLevelOptions}
          checkedOptions={educationLevels}
          onCheckChange={setEducationLevels}
        />
        <PopoverMultipleCheckbox
          label="Year"
          options={yearOptions}
          checkedOptions={years}
          onCheckChange={setYears}
        />
        <PopoverMultipleCheckbox
          label="Exam Type"
          options={examTypeOptions}
          checkedOptions={examTypes}
          onCheckChange={setExamTypes}
        />
        <PopoverMultipleCheckbox
          label="School"
          options={schoolOptions}
          checkedOptions={schools}
          onCheckChange={setSchools}
        />
        <PopoverMultipleCheckbox
          label="Subject"
          options={subjectOptions}
          checkedOptions={subjects}
          onCheckChange={setSubjects}
        />
        <PopoverMultipleCheckbox
          label="User"
          options={userOptions}
          checkedOptions={users}
          onCheckChange={setUsers}
        />
      </div>
      <Button onClick={handleApplyFilters} size={"lg"}>Apply</Button>
    </div>
  );
}
