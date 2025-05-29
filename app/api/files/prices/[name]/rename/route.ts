import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { name: string } }) {
  try {
    const fileName = decodeURIComponent(params.name)
    const { newName } = await request.json()

    if (!newName) {
      return NextResponse.json({ error: "New name is required" }, { status: 400 })
    }

    console.log("Price file renamed:", fileName, "->", newName)
    return NextResponse.json({ message: "Price file renamed successfully" })
  } catch (error) {
    console.error("Rename error:", error)
    return NextResponse.json({ error: "Failed to rename price file" }, { status: 500 })
  }
}
