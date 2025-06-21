import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"
import type { Certificate } from "@/lib/models"

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
    const certificates = await db.collection<Certificate>("certificates").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ certificates })
  } catch (error) {
    console.error("Get certificates error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await authenticateRequest(request)

    const certificateData = await request.json()

    const certificate: Certificate = {
      ...certificateData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const db = await getDatabase()
    const result = await db.collection<Certificate>("certificates").insertOne(certificate)

    return NextResponse.json(
      {
        message: "Certificate created successfully",
        certificateId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create certificate error:", error)
    return NextResponse.json({ error: "Failed to create certificate" }, { status: 500 })
  }
}
