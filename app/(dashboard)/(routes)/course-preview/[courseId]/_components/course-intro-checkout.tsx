"use client";

import axios from "axios";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, Loader2, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";
import { CourseEnrollButton } from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/_components/course-enroll-button";

interface CourseIntroCheckoutProps {
  courseId: string;
  coursePrice: number;
  alreadyPurchased: boolean;
}

export const CourseIntroCheckout = ({
  courseId,
  coursePrice,
  alreadyPurchased,
}: CourseIntroCheckoutProps) => {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountInPaise, setDiscountInPaise] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const baseAmountInPaise = Math.round(coursePrice * 100);
  const subtotalInPaise = Math.max(0, baseAmountInPaise - discountInPaise);
  const gstInPaise = Math.round(subtotalInPaise * 0.18);
  const totalAmountInPaise = subtotalInPaise + gstInPaise;

  const ctaLabel = useMemo(() => {
    if (alreadyPurchased) {
      return "Continue learning";
    }
    return `Proceed to pay ${formatPrice(totalAmountInPaise / 100)}`;
  }, [alreadyPurchased, totalAmountInPaise]);

  const onApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Enter a coupon code");
      return;
    }

    try {
      setIsApplyingCoupon(true);
      const response = await axios.post("/api/coupons/validate", {
        couponCode,
        amountInPaise: baseAmountInPaise,
      });

      setAppliedCoupon(response.data.couponCode || couponCode.toUpperCase());
      setDiscountInPaise(response.data.discountInPaise || 0);
      toast.success(response.data.message || "Coupon applied");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Invalid coupon";
      setAppliedCoupon(null);
      setDiscountInPaise(0);
      toast.error(message);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6 sticky top-24 shadow-xl">
      <div>
        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          Unlock Course
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Transparent pricing with instant lifetime access.
        </p>
      </div>

      <div className="space-y-3 text-sm bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between font-medium">
          <span className="text-slate-500 dark:text-slate-400">
            Course Charges
          </span>
          <span className="text-slate-900 dark:text-white">
            {formatPrice(baseAmountInPaise / 100)}
          </span>
        </div>
        {(discountInPaise > 0 || appliedCoupon) && (
          <div className="flex items-center justify-between font-medium">
            <span className="text-slate-500 dark:text-slate-400">Discount</span>
            <span className="text-emerald-500 font-bold">
              - {formatPrice(discountInPaise / 100)}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700/50 pt-3 font-medium">
          <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
          <span className="text-slate-900 dark:text-white">
            {formatPrice(subtotalInPaise / 100)}
          </span>
        </div>
        <div className="flex items-center justify-between font-medium">
          <span className="text-slate-500 dark:text-slate-400">GST (18%)</span>
          <span className="text-slate-900 dark:text-white">
            {formatPrice(gstInPaise / 100)}
          </span>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700/50 pt-3 mt-1 flex items-center justify-between">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Total payable
          </span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {formatPrice(totalAmountInPaise / 100)}
          </span>
        </div>
      </div>

      <div className="pt-2">
        {alreadyPurchased ? (
          <Button
            asChild
            className="w-full h-14 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <a href={`/courses/${courseId}`}>{ctaLabel}</a>
          </Button>
        ) : (
          <CourseEnrollButton
            courseId={courseId}
            price={totalAmountInPaise / 100}
            couponCode={appliedCoupon || undefined}
            ctaLabel={ctaLabel}
          />
        )}
      </div>

      <div className="rounded-xl border border-blue-500/20 bg-blue-50 dark:bg-blue-500/5 p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-400">
          <Tag className="h-4 w-4" />
          Have a promotional code?
        </div>
        {appliedCoupon ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              {appliedCoupon} applied successfully.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setAppliedCoupon(null);
                setDiscountInPaise(0);
                setCouponCode("");
              }}
              className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-900/30"
            >
              Remove Coupon
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              value={couponCode}
              onChange={(event) =>
                setCouponCode(event.target.value.toUpperCase())
              }
              placeholder="e.g. WELCOME10"
              disabled={isApplyingCoupon}
              className="bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800"
            />
            <Button
              type="button"
              variant="default"
              onClick={onApplyCoupon}
              disabled={isApplyingCoupon || !couponCode.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isApplyingCoupon ? (
                <span className="flex items-center gap-1">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                </span>
              ) : (
                "Apply"
              )}
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 p-5">
        <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          What&apos;s included
        </p>
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 font-medium">
          <p className="flex items-center gap-3">
            <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            Full lifetime access
          </p>
          <p className="flex items-center gap-3">
            <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            Chapter resources and attachments
          </p>
          <p className="flex items-center gap-3">
            <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            Certificate of completion
          </p>
        </div>
      </div>
    </div>
  );
};
