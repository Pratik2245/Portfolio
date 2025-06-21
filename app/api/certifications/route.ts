import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import type { Certificate } from "@/lib/models";

export async function GET() {
  try {
    const db = await getDatabase();

    const certificates = await db
      .collection<Certificate>("certificates")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ certificates }, { status: 200 });
  } catch (error) {
    console.error("Public certificates fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load certificates" },
      { status: 500 }
    );
  }
}
