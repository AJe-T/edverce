import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, email, organization, message } = await req.json();

    if (!name || !email || !message) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const query = await db.contactQuery.create({
      data: {
        name,
        email,
        organization,
        message,
      },
    });

    return NextResponse.json(query);
  } catch (error) {
    console.log("[CONTACT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
