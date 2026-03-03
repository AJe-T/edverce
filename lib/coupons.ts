export type Coupon = {
  code: string;
  type: "PERCENT" | "FLAT";
  value: number;
  maxDiscountInPaise?: number;
  minOrderAmountInPaise?: number;
  isActive: boolean;
};

type CouponQuote = {
  applied: boolean;
  couponCode: string | null;
  originalAmountInPaise: number;
  discountInPaise: number;
  finalAmountInPaise: number;
  message?: string;
};

const FALLBACK_COUPONS: Coupon[] = [
  {
    code: "WELCOME10",
    type: "PERCENT",
    value: 10,
    maxDiscountInPaise: 10000,
    isActive: true,
  },
  {
    code: "SAVE100",
    type: "FLAT",
    value: 10000,
    minOrderAmountInPaise: 20000,
    isActive: true,
  },
];

const parseCouponConfig = () => {
  const raw = process.env.COUPON_CODES_JSON;

  if (!raw) {
    return FALLBACK_COUPONS;
  }

  try {
    const parsed = JSON.parse(raw) as Coupon[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return FALLBACK_COUPONS;
    }
    return parsed;
  } catch {
    return FALLBACK_COUPONS;
  }
};

const normalizeCode = (code: string) => code.trim().toUpperCase();

export const findCoupon = (couponCode: string) => {
  const normalizedCode = normalizeCode(couponCode);
  return parseCouponConfig().find((coupon) => normalizeCode(coupon.code) === normalizedCode);
};

export const quoteCoupon = (amountInPaise: number, couponCode?: string | null): CouponQuote => {
  if (!couponCode || couponCode.trim().length === 0) {
    return {
      applied: false,
      couponCode: null,
      originalAmountInPaise: amountInPaise,
      discountInPaise: 0,
      finalAmountInPaise: amountInPaise,
    };
  }

  const coupon = findCoupon(couponCode);

  if (!coupon || !coupon.isActive) {
    return {
      applied: false,
      couponCode: null,
      originalAmountInPaise: amountInPaise,
      discountInPaise: 0,
      finalAmountInPaise: amountInPaise,
      message: "Invalid or inactive coupon code.",
    };
  }

  if (coupon.minOrderAmountInPaise && amountInPaise < coupon.minOrderAmountInPaise) {
    return {
      applied: false,
      couponCode: null,
      originalAmountInPaise: amountInPaise,
      discountInPaise: 0,
      finalAmountInPaise: amountInPaise,
      message: "Coupon minimum order amount is not met.",
    };
  }

  const rawDiscount =
    coupon.type === "PERCENT"
      ? Math.round((amountInPaise * coupon.value) / 100)
      : Math.round(coupon.value);

  const cappedDiscount = coupon.maxDiscountInPaise
    ? Math.min(rawDiscount, coupon.maxDiscountInPaise)
    : rawDiscount;

  const discountInPaise = Math.max(0, Math.min(amountInPaise, cappedDiscount));
  const finalAmountInPaise = Math.max(0, amountInPaise - discountInPaise);

  return {
    applied: discountInPaise > 0,
    couponCode: coupon.code,
    originalAmountInPaise: amountInPaise,
    discountInPaise,
    finalAmountInPaise,
    message: discountInPaise > 0 ? "Coupon applied successfully." : "Coupon did not change the amount.",
  };
};
