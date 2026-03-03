"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
  couponCode?: string;
  ctaLabel?: string;
}

export const CourseEnrollButton = ({
  price,
  courseId,
  couponCode,
  ctaLabel,
}: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const onClick = async () => {
    try {
      setIsLoading(true);
      setPaymentError(null);

      const response = await axios.post(`/api/courses/${courseId}/checkout`, {
        couponCode,
      });
      const redirectUrl = response.data?.redirectUrl as string | undefined;

      if (!redirectUrl) {
        setPaymentError("Unable to initialize PhonePe checkout. Please try again.");
        toast.error("Unable to initialize PhonePe checkout");
        return;
      }

      window.location.assign(redirectUrl);
    } catch (error: any) {
      const message = error?.response?.data || "Something went wrong";
      setPaymentError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full md:w-auto space-y-2">
      <Button
        onClick={onClick}
        disabled={isLoading}
        size="sm"
        className="w-full md:w-auto"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Redirecting...
          </span>
        ) : (
          <>{ctaLabel || `Proceed to pay ${formatPrice(price)}`}</>
        )}
      </Button>

      {paymentError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-2 text-xs text-destructive">
          <p>{paymentError}</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-2 h-7 px-2 text-destructive"
            onClick={onClick}
            disabled={isLoading}
          >
            <RefreshCcw className="mr-2 h-3.5 w-3.5" />
            Retry payment
          </Button>
        </div>
      )}
    </div>
  )
}
