"use client"

import { Course } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Pencil } from "lucide-react"
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Course Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "certificateSignature",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Signature
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const signature = row.getValue("certificateSignature") as string | null;
      
      return (
        <span className={signature ? "font-serif italic text-blue-600 dark:text-blue-400" : "text-muted-foreground italic"}>
          {signature || "No signature set"}
        </span>
      );
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <Link href={`/teacher/courses/${id}`}>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Edit course</span>
            <Pencil className="h-4 w-4" />
          </Button>
        </Link>
      )
    }
  }
]
