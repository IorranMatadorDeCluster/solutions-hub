import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock data for demonstration
    const mockPrices = [
      {
        name: "precos-janeiro-2024.csv",
        url: "/placeholder.svg?height=300&width=300",
        size: 1024 * 50, // 50KB
        lastModified: new Date().toISOString(),
        type: "text/csv",
      },
    ]

    return NextResponse.json({ files: mockPrices })
  } catch (error) {
    console.error("Error fetching prices:", error)
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 })
  }
}
