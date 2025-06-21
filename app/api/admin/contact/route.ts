import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDatabase();
    const contacts = await db.collection("contacts").find().toArray();

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
