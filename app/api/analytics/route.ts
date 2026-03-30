import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { getAnalytics } from "@/actions/get-analytics";
import type { AnalyticsGroupBy, AnalyticsPreset } from "@/lib/analytics";
import { isTeacher } from "@/lib/teacher";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const data = await getAnalytics({
      preset: (searchParams.get("preset") ?? undefined) as
        | AnalyticsPreset
        | undefined,
      groupBy: (searchParams.get("groupBy") ?? undefined) as
        | AnalyticsGroupBy
        | undefined,
      startDate: searchParams.get("startDate"),
      endDate: searchParams.get("endDate"),
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log("[ANALYTICS_API]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
