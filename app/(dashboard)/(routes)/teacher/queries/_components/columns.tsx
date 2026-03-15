"use client";

import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "organization",
    header: "Organization",
    cell: ({ row }) => {
      const org = row.getValue("organization") as string;
      return <span className="text-muted-foreground">{org || "N/A"}</span>;
    },
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => {
      const msg = row.getValue("message") as string;
      return (
        <div className="whitespace-pre-wrap break-words min-w-[250px] max-w-[500px]" title={msg}>
          {msg}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return <span>{new Date(date).toLocaleDateString()}</span>;
    },
  },
];
