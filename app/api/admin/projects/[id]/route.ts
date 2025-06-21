import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"
import type { Project } from "@/lib/models"
import { ObjectId } from "mongodb"

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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await authenticateRequest(request)

    const projectData = await request.json()
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    const db = await getDatabase()
    const result = await db.collection<Project>("projects").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...projectData,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Project updated successfully" })
  } catch (error) {
    console.error("Update project error:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await authenticateRequest(request)

    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    const db = await getDatabase()
    const result = await db.collection<Project>("projects").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Delete project error:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
