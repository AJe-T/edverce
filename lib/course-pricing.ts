export const COURSE_GST_RATE = 0.18;

type CalculateCourseCheckoutAmountsInput = {
  baseAmountInPaise: number;
  discountInPaise?: number;
};

export const calculateCourseCheckoutAmounts = ({
  baseAmountInPaise,
  discountInPaise = 0,
}: CalculateCourseCheckoutAmountsInput) => {
  const normalizedBaseAmountInPaise = Math.max(
    0,
    Math.round(baseAmountInPaise),
  );
  const normalizedDiscountInPaise = Math.max(
    0,
    Math.min(normalizedBaseAmountInPaise, Math.round(discountInPaise)),
  );
  const subtotalInPaise =
    normalizedBaseAmountInPaise - normalizedDiscountInPaise;
  const gstInPaise = Math.round(subtotalInPaise * COURSE_GST_RATE);
  const totalAmountInPaise = subtotalInPaise + gstInPaise;

  return {
    baseAmountInPaise: normalizedBaseAmountInPaise,
    discountInPaise: normalizedDiscountInPaise,
    subtotalInPaise,
    gstInPaise,
    totalAmountInPaise,
  };
};
