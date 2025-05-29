import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: { name: string } }) {
  try {
    const fileName = decodeURIComponent(params.name)
    console.log("Price file deleted:", fileName)
    return NextResponse.json({ message: "Price file deleted successfully" })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Failed to delete price file" }, { status: 500 })
  }
}
