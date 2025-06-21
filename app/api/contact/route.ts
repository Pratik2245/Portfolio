import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb"; // Adjust path if needed

export async function POST(req: NextRequest) {
  try {
    const db = await getDatabase();
    const body = await req.json();

    const result = await db.collection("contacts").insertOne(body);

    return NextResponse.json(
      { message: "Message sent", id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting contact form data:", error);
    return NextResponse.json(
      { message: "Failed to send message" },
      { status: 500 }
    );
  }
}
