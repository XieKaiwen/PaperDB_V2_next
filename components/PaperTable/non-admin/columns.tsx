import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import { AdminPaperDataForTable } from '../admin/types';

export const defaultColumns: ColumnDef<AdminPaperDataForTable>[] = [
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const paper = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                console.log('Pin paper with ID:', paper.id);
              }}
            >
              Pin paper
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: 'paperName',
    header: () => <div className="font-semibold">PAPER NAME</div>,
    cell: ({ row }) => {
      const {
        id,
        year,
        educationLevel,
        School: { schoolFullName, schoolShortName },
        Subject: { subjectName },
        examType,
      } = row.original;

      return (
        <div>
          <Link
            href={`/paper/${id}`}
            className="focus:text-blue-500-bold hidden font-bold hover:text-blue-500 hover:underline focus:underline md:block"
          >
            {year}/{educationLevel}/{schoolFullName}/{subjectName}/{examType}
          </Link>
          <Link
            href={`/paper/${id}`}
            className="focus:text-blue-500-bold font-bold hover:text-blue-500 hover:underline focus:underline md:hidden"
          >
            {year}/{educationLevel}/{schoolFullName}/{subjectName}/{examType}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: 'year',
    header: 'Year',
  },
  {
    accessorKey: 'educationLevel',
    header: 'Level',
  },
  {
    accessorKey: 'School.schoolFullName',
    header: 'School',
    cell: ({ row }) => {
      const { schoolFullName, schoolShortName } = row.original.School;
      return (
        <div>
          <p className="hidden sm:block">{schoolFullName}</p>
          <p className="sm:hidden">{schoolShortName}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'Subject.subjectName',
    header: 'Subject',
  },
  {
    accessorKey: 'examType',
    header: 'Exam type',
  },
  {
    accessorKey: 'totalMark',
    header: 'Total mark',
  },
];
