import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { comparePassword, generateToken } from "@/lib/auth";
import type { AdminUser } from "@/lib/models";
import { log } from "console";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    const NODE_ENV = "development";
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const user = await db
      .collection<AdminUser>("admin_users")
      .findOne({ username });
    console.log(user);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Update last login
    await db
      .collection("admin_users")
      .updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } });

    const token = generateToken(user._id!.toString());

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

    // Set HTTP-only cookie
    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: NODE_ENV === "development",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
