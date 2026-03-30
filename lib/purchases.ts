import { db } from "@/lib/db";

export const PURCHASE_ACCESS_MONTHS = 3;

export const isPurchaseActive = (
  purchase?: { createdAt: Date } | null,
  referenceDate = new Date(),
) => {
  if (!purchase) {
    return false;
  }

  const expirationDate = new Date(purchase.createdAt);
  expirationDate.setMonth(expirationDate.getMonth() + PURCHASE_ACCESS_MONTHS);

  return expirationDate >= referenceDate;
};

export const getPurchaseExpiryDate = (purchase?: { createdAt: Date } | null) => {
  if (!purchase) {
    return null;
  }

  const expirationDate = new Date(purchase.createdAt);
  expirationDate.setMonth(expirationDate.getMonth() + PURCHASE_ACCESS_MONTHS);
  return expirationDate;
};

export const findActivePurchase = async ({
  userId,
  courseId,
}: {
  userId: string;
  courseId: string;
}) => {
  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });

  return isPurchaseActive(purchase) ? purchase : null;
};
