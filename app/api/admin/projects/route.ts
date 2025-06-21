import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"
import type { Project } from "@/lib/models"

async function authenticateRequest(request: NextRequest) {
  const token = getTokenFromRequest(request)
  if (!token) {
    throw new Error("No token provided")
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    throw new Error("Invalid token")
  }

  return decoded.userId
}

export async function GET(request: NextRequest) {
  try {
    await authenticateRequest(request)

    const db = await getDatabase()
    const projects = await db.collection<Project>("projects").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ projects })
  } catch (error) {
    console.error("Get projects error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await authenticateRequest(request)

    const projectData = await request.json()

    const project: Project = {
      ...projectData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const db = await getDatabase()
    const result = await db.collection<Project>("projects").insertOne(project)

    return NextResponse.json(
      {
        message: "Project created successfully",
        projectId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create project error:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
