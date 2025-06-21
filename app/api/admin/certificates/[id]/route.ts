import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"
import type { Certificate } from "@/lib/models"
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

    const certificateData = await request.json()
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid certificate ID" }, { status: 400 })
    }

    const db = await getDatabase()
    const result = await db.collection<Certificate>("certificates").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...certificateData,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Certificate updated successfully" })
  } catch (error) {
    console.error("Update certificate error:", error)
    return NextResponse.json({ error: "Failed to update certificate" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await authenticateRequest(request)

    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid certificate ID" }, { status: 400 })
    }

    const db = await getDatabase()
    const result = await db.collection<Certificate>("certificates").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Certificate deleted successfully" })
  } catch (error) {
    console.error("Delete certificate error:", error)
    return NextResponse.json({ error: "Failed to delete certificate" }, { status: 500 })
  }
}
