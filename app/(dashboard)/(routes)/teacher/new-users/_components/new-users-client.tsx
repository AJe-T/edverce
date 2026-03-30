"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Download, Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Preset = "today" | "week" | "month" | "all";

interface NewUserRow {
  id: string;
  userId: string;
  name: string;
  email: string;
  courseTitle: string;
  price: number;
  couponCode: string;
  transactionId: string;
  createdAt: string; // ISO string
}

interface NewUsersClientProps {
  data: NewUserRow[];
  currentPreset: Preset;
}

const PRESETS: { label: string; value: Preset }[] = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "week" },
  { label: "This Month", value: "month" },
  { label: "All Time", value: "all" },
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const downloadCSV = (rows: NewUserRow[], preset: Preset) => {
  const headers = [
    "Name",
    "Email",
    "Course",
    "Price Paid",
    "Coupon Code",
    "Transaction ID",
    "User ID",
    "Date",
  ];
  const csvRows = rows.map((r) =>
    [
      `"${r.name}"`,
      `"${r.email}"`,
      `"${r.courseTitle}"`,
      r.price,
      `"${r.couponCode}"`,
      `"${r.transactionId}"`,
      `"${r.userId}"`,
      `"${formatDate(r.createdAt)}"`,
    ].join(","),
  );
  const csv = [headers.join(","), ...csvRows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `new-users-${preset}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const NewUsersClient = ({ data, currentPreset }: NewUsersClientProps) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [couponFilter, setCouponFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const uniqueCoupons = Array.from(new Set(data.map((d) => d.couponCode))).filter(
    (c) => c !== "None",
  );

  const filteredData = data.filter((row) => {
    const matchesSearch =
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.email.toLowerCase().includes(search.toLowerCase()) ||
      row.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
      row.transactionId.toLowerCase().includes(search.toLowerCase()) ||
      row.userId.toLowerCase().includes(search.toLowerCase());
    const matchesCoupon = couponFilter ? row.couponCode === couponFilter : true;
    return matchesSearch && matchesCoupon;
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const totalRevenue = filteredData.reduce((sum, r) => sum + r.price, 0);
  const uniqueStudents = new Set(filteredData.map((r) => r.userId)).size;

  // Reset to page 1 when filters change
  const handleSearchChange = (val: string) => { setSearch(val); setCurrentPage(1); };
  const handleCouponChange = (val: string) => { setCouponFilter(val); setCurrentPage(1); };

  return (
    <div className="space-y-4">
      {/* Preset buttons + Download */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <Button
              key={preset.value}
              variant={currentPreset === preset.value ? "default" : "outline"}
              className={cn(
                "rounded-full",
                currentPreset === preset.value &&
                  "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900",
              )}
              onClick={() =>
                router.push(`/teacher/new-users?preset=${preset.value}`)
              }
            >
              {preset.label}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          className="gap-2 rounded-full"
          onClick={() => downloadCSV(filteredData, currentPreset)}
          disabled={filteredData.length === 0}
        >
          <Download className="h-4 w-4" />
          Download CSV
        </Button>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300">
          <Users className="h-4 w-4" />
          {filteredData.length} Purchases · {uniqueStudents} Unique Students
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
          Revenue: {formatPrice(totalRevenue)}
        </div>
      </div>

      {/* Search + Coupon filter */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
          <Input
            placeholder="Search by User, Course, ID, or Trxn..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 rounded-full bg-slate-50 dark:bg-slate-800"
          />
        </div>
        <div className="w-full md:w-auto">
          <select
            value={couponFilter}
            onChange={(e) => handleCouponChange(e.target.value)}
            className="h-10 w-full md:w-[180px] px-3 py-2 rounded-md border border-input bg-transparent text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">All Coupons</option>
            {uniqueCoupons.map((coupon) => (
              <option key={coupon} value={coupon}>
                {coupon}
              </option>
            ))}
            <option value="None">No Coupon</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
            <TableRow>
              <TableHead>User Details</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Price Paid</TableHead>
              <TableHead>Coupon</TableHead>
              <TableHead className="hidden md:table-cell">Transaction ID / User ID</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-slate-500">
                  No purchases found for the selected period.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{row.name}</span>
                      <span className="text-sm text-slate-500">{row.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{row.courseTitle}</TableCell>
                  <TableCell>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 font-bold rounded-md text-sm">
                      {formatPrice(row.price)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {row.couponCode !== "None" ? (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 rounded-md text-xs font-semibold">
                        {row.couponCode}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-sm italic">None</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col gap-y-1">
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-mono" title="Transaction ID">
                        Txn: {row.transactionId}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono" title="User ID">
                        UID: {row.userId}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap text-sm text-slate-500">
                    {formatDate(row.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      {filteredData.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {Math.min(filteredData.length, startIndex + 1)}
            </span>
            {"–"}
            <span className="font-medium text-foreground">
              {Math.min(filteredData.length, startIndex + ITEMS_PER_PAGE)}
            </span>
            {" of "}
            <span className="font-medium text-foreground">{filteredData.length}</span>
            {" entries"}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <span className="text-sm font-medium px-2">
              Page {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
