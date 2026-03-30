"use client"

import { Course } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, CheckCircle2, ImageOff } from "lucide-react"
import Image from "next/image";

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
    accessorKey: "certificateSignatureUrl",
    header: "Signature Image",
    cell: ({ row }) => {
      const url = row.getValue("certificateSignatureUrl") as string | null;
      if (url) {
        return (
          <div className="relative w-24 h-10 bg-[#0A0F1C] rounded border border-blue-900 overflow-hidden">
            <Image
              src={url}
              alt="Signature"
              fill
              className="object-contain p-1"
              unoptimized
            />
          </div>
        );
      }
      return (
        <span className="flex items-center gap-1.5 text-muted-foreground italic text-sm">
          <ImageOff className="h-3.5 w-3.5" />
          No image
        </span>
      );
    }
  },
  {
    accessorKey: "certificateSignature",
    header: "Signature Label",
    cell: ({ row }) => {
      const signature = row.getValue("certificateSignature") as string | null;
      return (
        <span className={signature ? "font-serif italic text-blue-600 dark:text-blue-400" : "text-muted-foreground italic"}>
          {signature || "No label set"}
        </span>
      );
    }
  },
  {
    accessorKey: "lastModifiedBy",
    header: "Last Modified By",
    cell: ({ row }) => {
      const modifiedBy = row.getValue("lastModifiedBy") as string | null;
      return modifiedBy ? (
        <span className="flex items-center gap-1.5 text-xs bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-md border border-blue-200 dark:border-blue-800 whitespace-nowrap w-max">
          <CheckCircle2 className="h-3 w-3" />
          {modifiedBy}
        </span>
      ) : (
        <span className="text-muted-foreground text-xs italic">—</span>
      );
    }
  },
]
