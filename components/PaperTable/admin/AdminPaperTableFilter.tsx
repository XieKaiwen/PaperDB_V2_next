'use client';
import { generateOptionsFromJsonList, setSearchParams } from '@/utils/utils';
import { edu_level, exam_type, School, Subject, User } from '@prisma/client';
import React, { useMemo, useState } from 'react';
import { MemoizedPopoverMultipleCheckbox } from '../../PopoverMultipleCheckbox';
import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';
import { useRouter, useSearchParams } from 'next/navigation';
import { ParsedPaperFilterLooseProps } from '@/src/types/types';

interface AdminPaperTableFilterProps {
  filterValues: {
    educationLevels: edu_level[];
    years: string[];
    examTypes: exam_type[];
    schools: School[];
    subjects: Subject[];
    users: User[];
  };
  activeFilters: ParsedPaperFilterLooseProps;
}
export default function AdminPaperTableFilter({
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
    fetchNonVisible = false,
  },
}: AdminPaperTableFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  console.log('Filter values: ', {
    educationLevelsFilterValues,
    yearsFilterValues,
    examTypesFilterValues,
    schoolsFilterValues,
    subjectsFilterValues,
    usersFilterValues,
  });
  console.log('Filters from search params: ', {
    activeEducationLevels,
    activeYears,
    activeExamTypes,
    activeSchools,
    activeSubjects,
    activeUserIds,
    fetchVisible,
    fetchNonVisible,
  });
  // Generate the options from the filter values
  const educationLevelOptions = useMemo(() => {
    const optionsList = educationLevelsFilterValues.map((level) => {
      return { value: level, label: level };
    });
    return optionsList;
  }, [educationLevelsFilterValues]);
  const yearOptions = useMemo(() => {
    const optionsList = yearsFilterValues.map((year) => {
      return { value: year, label: year };
    });
    return optionsList;
  }, [yearsFilterValues]);
  const examTypeOptions = useMemo(() => {
    const optionsList = examTypesFilterValues.map((type) => {
      return { value: type, label: type };
    });
    return optionsList;
  }, [examTypesFilterValues]);
  const schoolOptions = useMemo(() => {
    const optionsList = generateOptionsFromJsonList(schoolsFilterValues, 'id', 'schoolFullName');
    return optionsList;
  }, [schoolsFilterValues]);
  const subjectOptions = useMemo(() => {
    const optionsList = generateOptionsFromJsonList(subjectsFilterValues, 'id', 'subjectName');
    return optionsList;
  }, [subjectsFilterValues]);
  const userOptions = useMemo(() => {
    const optionsList = generateOptionsFromJsonList(usersFilterValues, 'id', 'email');
    return optionsList;
  }, [usersFilterValues]);

  const [educationLevels, setEducationLevels] = useState<string[]>(
    activeEducationLevels.filter((level) =>
      educationLevelsFilterValues.includes(level as edu_level),
    ),
  );
  const [years, setYears] = useState<string[]>(
    activeYears.filter((year) => yearsFilterValues.includes(year)),
  );
  const [examTypes, setExamTypes] = useState<string[]>(
    activeExamTypes.filter((type) => examTypesFilterValues.includes(type as exam_type)),
  );
  const [schools, setSchools] = useState<string[]>(
    activeSchools.filter((school) => schoolsFilterValues.some((s) => s.id === school)),
  );
  const [subjects, setSubjects] = useState<string[]>(
    activeSubjects.filter((subject) => subjectsFilterValues.some((s) => s.id === subject)),
  );
  const [users, setUsers] = useState<string[]>(
    activeUserIds.filter((userId) => usersFilterValues.some((u) => u.id === userId)),
  );
  const [includeVisible, setIncludeVisible] = useState(fetchVisible);
  const [includeNonVisible, setIncludeNonVisible] = useState(fetchNonVisible);

  const handleApplyFilters = () => {
    // Implement the logic you want to perform when filters are applied.
    // You can access all selected arrays here.
    console.log('Filters applied with:', {
      educationLevels,
      years,
      examTypes,
      schools,
      subjects,
      users,
      includeVisible,
      includeNonVisible,
    });
    const params = new URLSearchParams(searchParams.toString());
    setSearchParams({
      searchParams: params,
      paramsToSet: {
        year: years,
        school: schools,
        subject: subjects,
        examType: examTypes,
        edul: educationLevels,
        users: users,
        visible: includeVisible,
        nonVisible: includeNonVisible,
      },
    });
    const updatedURL = `/admin/paper?${params.toString()}`;
    router.push(updatedURL);
  };

  return (
    <div className="space-y-4 border border-slate-400 p-4">
      <h2 className="text-2xl font-semibold underline underline-offset-2">Filter papers</h2>
      <div className="flex flex-wrap gap-12">
        <MemoizedPopoverMultipleCheckbox
          label="Education Level"
          options={educationLevelOptions}
          checkedOptions={educationLevels}
          onCheckChange={setEducationLevels}
        />
        <MemoizedPopoverMultipleCheckbox
          label="Year"
          options={yearOptions}
          checkedOptions={years}
          onCheckChange={setYears}
        />
        <MemoizedPopoverMultipleCheckbox
          label="Exam Type"
          options={examTypeOptions}
          checkedOptions={examTypes}
          onCheckChange={setExamTypes}
        />
        <MemoizedPopoverMultipleCheckbox
          label="School"
          options={schoolOptions}
          checkedOptions={schools}
          onCheckChange={setSchools}
        />
        <MemoizedPopoverMultipleCheckbox
          label="Subject"
          options={subjectOptions}
          checkedOptions={subjects}
          onCheckChange={setSubjects}
        />
        <MemoizedPopoverMultipleCheckbox
          label="User"
          options={userOptions}
          checkedOptions={users}
          onCheckChange={setUsers}
        />
      </div>
      <div className="flex gap-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={includeVisible}
            onCheckedChange={(checked) => {
              setIncludeVisible(checked === true);
            }}
          />

          <label
            htmlFor="visible"
            className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Visible
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={includeNonVisible}
            onCheckedChange={(checked) => {
              setIncludeNonVisible(checked === true);
            }}
          />
          <label
            htmlFor="non-visible"
            className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Non-visible
          </label>
        </div>
      </div>
      <Button onClick={handleApplyFilters} size={'lg'}>
        Apply
      </Button>
    </div>
  );
}
