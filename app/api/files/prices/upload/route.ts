import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const fileName = formData.get("fileName") as string

    if (!file || !fileName) {
      return NextResponse.json({ error: "File and fileName are required" }, { status: 400 })
    }

    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]

    if (!validTypes.includes(file.type) && !file.name.endsWith(".csv")) {
      return NextResponse.json({ error: "File must be CSV, XLS, or XLSX" }, { status: 400 })
    }

    console.log("Price file uploaded:", fileName, file.size, "bytes")

    return NextResponse.json({
      message: "Price file uploaded successfully",
      fileName: fileName,
      size: file.size,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload price file" }, { status: 500 })
  }
}
