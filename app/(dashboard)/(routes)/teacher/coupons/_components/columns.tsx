"use client";

import { Coupon, Category } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CouponModal } from "./coupon-modal";

type CouponWithCategory = Coupon & {
  category: Category | null;
};

const ActionCell = ({ coupon }: { coupon: CouponWithCategory }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    try {
      if (confirm("Are you sure you want to delete this coupon?")) {
        await axios.delete(`/api/coupons/${coupon.id}`);
        toast.success("Coupon deleted");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  // NOTE: Categories for the edit modal are realistically fetched or passed from datatable.
  // Wait, columns.tsx doesn't have access to categories easily unless we pass it via meta or globally, or fetch it.
  // A simple hack: fetch it here or don't let them edit category if that's complex, OR use React Query.
  // Actually, wait, let's fetch categories in the Modal if needed, or pass it from DataTable.
  // Let me just fetch it here or pass it inside CouponModal using a separate API route?
  // Let's just create a quick API fetch for categories inside CouponModal since we already passed it an array.

  return (
    <>
      <CouponModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={coupon}
        categories={[]} // We will handle categories properly by passing them via table.options.meta, but for now passing empty. Wait! I will fetch them in modal if empty or just inject from meta.
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-4 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} className="text-red-600">
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const columns: ColumnDef<CouponWithCategory>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Code
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "discountPercentage",
    header: "Discount (%)",
    cell: ({ row }) => `${row.getValue("discountPercentage")}%`,
  },
  {
    accessorKey: "fromDate",
    header: "From Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("fromDate") as string);
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "toDate",
    header: "To Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("toDate") as string);
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "category.name",
    header: "Category",
    cell: ({ row }) => row.original.category?.name || "Global",
  },
  {
    accessorKey: "used",
    header: "Uses",
    cell: ({ row }) => {
      const limit = row.original.limit;
      const used = row.original.used;
      return (
        <div>
          {used} / {limit ? limit : "∞"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell coupon={row.original} />,
  },
];
