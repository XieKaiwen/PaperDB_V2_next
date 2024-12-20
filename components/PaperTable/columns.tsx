import { ColumnDef } from "@tanstack/react-table";
import { PaperDataForTable } from "./types";

export function columnConstructor(type: "admin" | "default") {
  const columns: ColumnDef<PaperDataForTable>[] = [
    {
      accessorKey: "year",
      header: "Year",
    },
    {
      accessorKey: "educationLevel",
      header: "Level",
    },
    {
      accessorKey: "School.schoolFullName",
      header: "School",
      cell: ({ row }) => {
        const schoolName = row.original.School.schoolFullName;
        const schoolShortName = row.original.School.schoolShortName;
        return (
          <div>
            <p className="hidden sm:block">{schoolName}</p>
            <p className="sm:hidden">{schoolShortName}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "Subject.subjectName",
      header: "Subject",
    },
    {
      accessorKey: "examType",
      header: "Exam type",
    },
    {
      accessorKey: "totalMark",
      header: "Total mark",
    },
  ];

  if (type === "default") {
    return columns;
  } else if (type === "admin") {
    const extraColumns: ColumnDef<PaperDataForTable>[] = [
      {
        accessorKey: "User.username",
        header: "Created by",
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
        accessorKey: "dateAdded",
        header: "Date added",
        cell: ({ row }) => {
          const date = row.original.dateAdded;
          return date.toLocaleDateString("en-GB");
        },
      },
      {
        accessorKey: "visible",
        header: () => <div className="w-full flex justify-center items-center">Visible</div>,
        cell: ({ row }) => {
          const visible = row.original.visible;
          return (
            <div className="w-full flex justify-center items-center">
              <div
                className={`w-6 h-6 rounded-full ${
                  visible ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
            </div>
          );
        },
      },
    ];

    const adminColumns = [...columns, ...extraColumns];
    return adminColumns;
  }
  return columns;
}
