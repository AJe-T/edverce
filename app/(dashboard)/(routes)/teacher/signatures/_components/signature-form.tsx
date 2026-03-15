"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  courseId: z.string().min(1, { message: "Course is required" }),
  certificateSignature: z.string().min(1, { message: "Signature is required" }),
});

export const SignatureForm = ({ courses }: { courses: any[] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: "",
      certificateSignature: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  
  const selectedCourseId = form.watch("courseId");

  useEffect(() => {
    if (selectedCourseId) {
      const course = courses.find((c) => c.id === selectedCourseId);
      if (course && course.certificateSignature) {
        form.setValue("certificateSignature", course.certificateSignature);
      } else {
        form.setValue("certificateSignature", "");
      }
    }
  }, [selectedCourseId, courses, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${values.courseId}`, {
        certificateSignature: values.certificateSignature,
      });
      toast.success("Signature updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-50 dark:bg-slate-900 rounded-xl p-6">
      <div className="font-medium flex items-center justify-between mb-4 text-xl">
        Course Certificate Signature
        <Button
          onClick={toggleEdit}
          variant="ghost"
          className="bg-slate-200 dark:bg-slate-800"
        >
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Signature
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="text-sm mt-2 text-slate-500 italic">
          Select &quot;Edit Signature&quot; to update the certificate signature for a specific course.
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-4"
          >
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  <FormControl>
                    <select
                      disabled={isSubmitting}
                      className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      <option value="" disabled>Select a course...</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="certificateSignature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Signature Text</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting || !selectedCourseId}
                      placeholder="e.g. 'John Doe, Lead Instructor'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2 pt-4 border-t">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                className="w-full sm:w-auto mt-2"
              >
                Save Signature
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
