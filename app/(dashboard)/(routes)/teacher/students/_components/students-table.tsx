"use client";

import { useState } from "react";
import {
  BookOpen,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface StudentTableProps {
  students: {
    id: string;
    email: string;
    name: string;
    imageUrl: string;
    courses: {
      id: string;
      title: string;
      progress: number;
      purchasedAt: Date | null;
      expiresAt: Date | null;
    }[];
  }[];
}

export const StudentsTable = ({ students }: StudentTableProps) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter students by email OR name
  const filteredStudents = students.filter(
    (s) =>
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Pagination bounds
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by email or name..."
            className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
          />
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-slate-900 border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-slate-50 dark:bg-slate-800 border-b">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">
                  Student Name
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Email
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Enrolled Courses
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-right">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {currentStudents.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    {search
                      ? "No students match your search."
                      : "No students have enrolled in your courses yet."}
                  </td>
                </tr>
              )}
              {currentStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {student.imageUrl ? (
                        <img
                          src={student.imageUrl}
                          alt={student.name}
                          className="w-8 h-8 rounded-full border border-white/10"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-medium">
                          {student.name.charAt(0)}
                        </div>
                      )}
                      <span className="font-semibold">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {student.email}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-4">
                      {student.courses.map((course) => {
                        const isExpired =
                          course.expiresAt &&
                          new Date() > new Date(course.expiresAt);

                        return (
                          <div
                            key={course.id}
                            className="flex flex-col gap-1 pb-1"
                          >
                            <div className="flex items-center gap-2 font-medium line-clamp-1">
                              <BookOpen className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              {course.title}
                            </div>

                            {course.purchasedAt && course.expiresAt && (
                              <div className="text-[11px] text-muted-foreground mt-0.5 flex gap-3">
                                <span>
                                  Bought:{" "}
                                  {new Date(
                                    course.purchasedAt,
                                  ).toLocaleDateString()}
                                </span>
                                <span
                                  className={
                                    isExpired
                                      ? "text-red-500 font-semibold"
                                      : "text-amber-500/80"
                                  }
                                >
                                  {isExpired ? "Expired: " : "Expires: "}
                                  {new Date(
                                    course.expiresAt,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            )}

                            {/* Progress Bar inside cell */}
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-1 relative overflow-hidden">
                              <div
                                className={`h-1.5 rounded-full ${
                                  course.progress === 100
                                    ? "bg-emerald-500"
                                    : "bg-blue-500"
                                }`}
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="space-y-4">
                      {student.courses.map((course) => (
                        <div
                          key={course.id}
                          className="text-xs font-semibold tabular-nums h-8 flex items-center justify-end"
                        >
                          {course.progress === 100 ? (
                            <div className="flex items-center gap-x-3">
                              <span className="text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
                                Completed
                              </span>
                              <Link
                                href={`/certificates/${course.id}?studentId=${student.id}`}
                                target="_blank"
                                title="Download Certificate"
                              >
                                <div className="p-1.5 bg-blue-600/10 hover:bg-blue-600/20 rounded-md transition-colors cursor-pointer group">
                                  <Download className="w-4 h-4 text-blue-500 group-hover:text-blue-600" />
                                </div>
                              </Link>
                            </div>
                          ) : (
                            <span className="text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                              {Math.round(course.progress)}%
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {Math.min(filteredStudents.length, startIndex + 1)}
          </span>{" "}
          to{" "}
          <span className="font-medium text-foreground">
            {Math.min(filteredStudents.length, endIndex)}
          </span>{" "}
          of{" "}
          <span className="font-medium text-foreground">
            {filteredStudents.length}
          </span>{" "}
          entries
        </div>
        <div className="flex items-center gap-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
