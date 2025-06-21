import { NextResponse } from "next/server";

// ⚠️ Set this manually for testing purposes
const NODE_ENV = "development"; // or "production"

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  response.cookies.set("admin-token", "", {
    httpOnly: true,
    secure: NODE_ENV === "development", // ✅ static
    sameSite: "strict",
    maxAge: 0, // immediately expire
  });

  return response;
}
