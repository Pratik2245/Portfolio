import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"
import type { Skill } from "@/lib/models"
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

    const skillData = await request.json()
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid skill ID" }, { status: 400 })
    }

    const db = await getDatabase()
    const result = await db.collection<Skill>("skills").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...skillData,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Skill category not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Skill category updated successfully" })
  } catch (error) {
    console.error("Update skill error:", error)
    return NextResponse.json({ error: "Failed to update skill category" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await authenticateRequest(request)

    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid skill ID" }, { status: 400 })
    }

    const db = await getDatabase()
    const result = await db.collection<Skill>("skills").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Skill category not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Skill category deleted successfully" })
  } catch (error) {
    console.error("Delete skill error:", error)
    return NextResponse.json({ error: "Failed to delete skill category" }, { status: 500 })
  }
}
