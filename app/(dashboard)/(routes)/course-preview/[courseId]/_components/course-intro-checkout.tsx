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
    <div className="rounded-xl border bg-card p-5 space-y-5 sticky top-24">
      <div>
        <h3 className="text-lg font-semibold">Pricing</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Transparent pricing with instant course access.
        </p>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Course Charges</span>
          <span>{formatPrice(baseAmountInPaise / 100)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Discount</span>
          <span
            className={
              discountInPaise > 0 ? "text-emerald-700 font-medium" : ""
            }
          >
            - {formatPrice(discountInPaise / 100)}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-dashed pt-2">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotalInPaise / 100)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">GST (18%)</span>
          <span>{formatPrice(gstInPaise / 100)}</span>
        </div>
        <div className="border-t pt-2 flex items-center justify-between font-semibold">
          <span>Total payable</span>
          <span>{formatPrice(totalAmountInPaise / 100)}</span>
        </div>
      </div>

      {alreadyPurchased ? (
        <Button asChild className="w-full">
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

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Tag className="h-4 w-4" />
          Apply coupon
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={couponCode}
            onChange={(event) =>
              setCouponCode(event.target.value.toUpperCase())
            }
            placeholder="e.g. WELCOME10"
            disabled={isApplyingCoupon}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={onApplyCoupon}
            disabled={isApplyingCoupon}
          >
            {isApplyingCoupon ? (
              <span className="flex items-center gap-1">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Applying
              </span>
            ) : (
              "Apply"
            )}
          </Button>
        </div>
        {appliedCoupon && (
          <p className="text-xs text-emerald-700">
            {appliedCoupon} applied successfully.
          </p>
        )}
      </div>

      <div className="space-y-2 rounded-lg border p-3">
        <p className="text-sm font-medium">What is included</p>
        <div className="space-y-1.5 text-xs text-muted-foreground">
          <p className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            Full course access
          </p>
          <p className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            Chapter resources and attachments
          </p>
          <p className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            Progress tracking dashboard
          </p>
        </div>
      </div>
    </div>
  );
};
