// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, subject, message } = body;
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db("portfolio"); // Use your DB name
    const contacts = db.collection("contacts");

    const result = await contacts.insertOne({
      name,
      email,
      subject,
      message,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Message sent successfully", id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting contact message:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
