import { NextResponse } from "next/server";

import { quoteCoupon } from "@/lib/coupons";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const amountInPaise = Number(body?.amountInPaise);
    const couponCode = typeof body?.couponCode === "string" ? body.couponCode : "";

    if (!Number.isFinite(amountInPaise) || amountInPaise < 0) {
      return new NextResponse("Invalid amount", { status: 400 });
    }

    const quote = quoteCoupon(amountInPaise, couponCode);

    if (!quote.applied) {
      return NextResponse.json(quote, { status: 400 });
    }

    return NextResponse.json(quote);
  } catch (error) {
    console.log("[COUPON_VALIDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
