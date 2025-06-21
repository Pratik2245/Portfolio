import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDatabase();
    const contactId = params.id;

    const result = await db
      .collection("contacts")
      .deleteOne({ _id: new ObjectId(contactId) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
