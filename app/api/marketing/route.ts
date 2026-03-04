import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function PATCH(req: Request) {
  try {
    const { userId } = auth();
    const values = await req.json();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const setting = await db.marketingSetting.upsert({
      where: { id: "default" },
      update: { ...values },
      create: { id: "default", ...values },
    });

    return NextResponse.json(setting);
  } catch (error) {
    console.log("[MARKETING]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
