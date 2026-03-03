"use client";

import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const formSchema = z.object({
  code: z.string().min(1, { message: "Code is required" }),
  discountPercentage: z.coerce.number().min(1).max(100),
  fromDate: z.string().min(1, { message: "From date is required" }),
  toDate: z.string().min(1, { message: "To date is required" }),
  categoryId: z.string().optional(),
  limit: z.coerce.number().optional(),
});

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  categories: { id: string; name: string }[];
}

export const CouponModal = ({
  isOpen,
  onClose,
  initialData,
  categories,
}: CouponModalProps) => {
  const router = useRouter();
  const [isConfetti, setIsConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: initialData?.code || "",
      discountPercentage: initialData?.discountPercentage || 10,
      fromDate: initialData?.fromDate
        ? new Date(initialData.fromDate).toISOString().split("T")[0]
        : "",
      toDate: initialData?.toDate
        ? new Date(initialData.toDate).toISOString().split("T")[0]
        : "",
      categoryId: initialData?.categoryId || "",
      limit: initialData?.limit || undefined,
    },
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (initialData) {
      form.reset({
        code: initialData.code || "",
        discountPercentage: initialData.discountPercentage || 0,
        fromDate: initialData.fromDate
          ? new Date(initialData.fromDate).toISOString().split("T")[0]
          : "",
        toDate: initialData.toDate
          ? new Date(initialData.toDate).toISOString().split("T")[0]
          : "",
        categoryId: initialData.categoryId || "",
        limit: initialData.limit || undefined,
      });
    } else {
      form.reset({
        code: "",
        discountPercentage: 10,
        fromDate: "",
        toDate: "",
        categoryId: "",
        limit: undefined,
      });
    }
  }, [initialData, form, isOpen]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        ...values,
        categoryId: values.categoryId === "" ? null : values.categoryId,
        limit: values.limit || null,
      };

      if (initialData) {
        await axios.patch(`/api/coupons/${initialData.id}`, payload);
        toast.success("Coupon updated");
      } else {
        await axios.post("/api/coupons", payload);
        toast.success("Coupon created");
        setIsConfetti(true);
        setTimeout(() => setIsConfetti(false), 5000);
      }

      onClose();
      router.refresh();
      if (!initialData) {
        form.reset();
      }
    } catch (error: any) {
      if (error.response?.data) {
        toast.error(error.response.data);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <>
      {isConfetti && (
        <div className="fixed inset-0 z-[100] pointer-events-none">
          <Confetti width={windowSize.width} height={windowSize.height} />
        </div>
      )}
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {initialData ? "Edit Coupon" : "Create Coupon"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coupon Code</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g. SUMMER20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discountPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount %</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={isSubmitting}
                        placeholder="e.g. 20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fromDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Date</FormLabel>
                      <FormControl>
                        <Input type="date" disabled={isSubmitting} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="toDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To Date</FormLabel>
                      <FormControl>
                        <Input type="date" disabled={isSubmitting} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category (Optional)</FormLabel>
                    <FormControl>
                      <select
                        disabled={isSubmitting}
                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={field.value}
                        onChange={field.onChange}
                      >
                        <option value="">Global (All courses)</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
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
                name="limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usage Limit (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={isSubmitting}
                        placeholder="e.g. 100"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end pt-4">
                <Button disabled={isSubmitting} type="submit">
                  {initialData ? "Save changes" : "Create Coupon"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
