import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import type { Project } from "@/lib/models";

export async function GET() {
  try {
    const db = await getDatabase();

    const projects = await db
      .collection<Project>("projects")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("Public projects fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load projects" },
      { status: 500 }
    );
  }
}
