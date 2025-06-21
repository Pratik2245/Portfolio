import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const db = await getDatabase();
    const user = await db
      .collection("admin_users")
      .findOne(
        { _id: new ObjectId(decoded.userId) },
        { projection: { password: 0 } }
      );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
