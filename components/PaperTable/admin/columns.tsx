'use client';
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
import { AdminPaperDataForTable } from './types';

export const adminColumns: ColumnDef<AdminPaperDataForTable>[] = [
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
                console.log('Toggling visibility for ID:', paper.id);
              }}
            >
              Toggle visibility
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                console.log('Deleting paper with ID:', paper.id);
              }}
              className="text-red-600 hover:!bg-red-100 hover:!text-red-800"
            >
              Delete paper
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
            href={`/admin/paper/${id}`}
            className="hidden font-bold hover:text-blue-500 hover:underline focus:text-blue-500 focus:underline md:block"
          >
            {year}/{educationLevel}/{schoolFullName}/{subjectName}/{examType}
          </Link>
          <Link
            href={`/admin/paper/${id}`}
            className="font-bold hover:text-blue-500 hover:underline focus:text-blue-500 focus:underline md:hidden"
          >
            {year}/{educationLevel}/{schoolShortName}/{subjectName}/{examType}
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
  {
    accessorKey: 'User.username',
    header: 'Created by',
    cell: ({ row }) => {
      const username = row.original.User.username;
      const email = row.original.User.email;

      return (
        <div>
          <p>name: {username}</p>
          <p>email: {email}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'dateAdded',
    header: 'Date added',
    cell: ({ row }) => {
      const date = row.original.dateAdded;
      return date.toLocaleDateString('en-GB');
    },
  },
  {
    accessorKey: 'visible',
    header: () => <div className="flex w-full items-center justify-center">Visible</div>,
    cell: ({ row }) => {
      const visible = row.original.visible;
      return (
        <div className="flex w-full items-center justify-center">
          <div className={`h-6 w-6 rounded-full ${visible ? 'bg-green-500' : 'bg-red-500'}`}></div>
        </div>
      );
    },
  },
];
