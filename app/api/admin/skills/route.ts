import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"
import type { Skill } from "@/lib/models"

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
    const skills = await db.collection<Skill>("skills").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ skills })
  } catch (error) {
    console.error("Get skills error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await authenticateRequest(request)

    const skillData = await request.json()

    const skill: Skill = {
      ...skillData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const db = await getDatabase()
    const result = await db.collection<Skill>("skills").insertOne(skill)

    return NextResponse.json(
      {
        message: "Skill category created successfully",
        skillId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create skill error:", error)
    return NextResponse.json({ error: "Failed to create skill category" }, { status: 500 })
  }
}
