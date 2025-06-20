import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 })
    }

    if (file.type !== "text/csv") {
      return NextResponse.json({ error: "File must be a CSV" }, { status: 400 })
    }

    // Read the file content
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const csvContent = buffer.toString("utf-8")

    // Here you can process the CSV content or send it to another service
    // For example, you could:
    // 1. Parse the CSV data
    // 2. Send it to an external API
    // 3. Store it in a database
    // 4. Process it with your business logic

    console.log("CSV file received:", file.name)
    console.log("File size:", file.size, "bytes")
    console.log("CSV content preview:", csvContent.substring(0, 200) + "...")

    // Example: Send to external API (uncomment and modify as needed)
    /*
    const externalResponse = await fetch('https://your-api-endpoint.com/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: file.name,
        data: csvContent,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!externalResponse.ok) {
      throw new Error('Failed to send data to external API')
    }
    */

    return NextResponse.json({
      message: "File uploaded successfully",
      filename: file.name,
      size: file.size,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to process file" }, { status: 500 })
  }
}
