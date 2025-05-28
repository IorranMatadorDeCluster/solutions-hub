import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 })
    }

    // Read and process the CSV
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const csvContent = buffer.toString("utf-8")

    const lines = csvContent.split('\n')
    const dataLines = lines.slice(1).filter(line => line.trim())

    // Create clients array
    const clients = dataLines.map(line => {
      const [name, number] = line.split(',').map(item => item.trim())
      return {
        name,
        number: number.replace(/\D/g, '')
      }
    })

    // Send to external service
    const response = await fetch('https://primary-production-dd2e.up.railway.app/webhook/load', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ activate: clients })
    })

    if (!response.ok) {
      throw new Error('Failed to send data to external service')
    }

    return NextResponse.json({
      message: "File processed successfully",
      filename: file.name
    })

  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to process file" }, { status: 500 })
  }
}