import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real application, you would execute a SQL query to fetch data
    // For demonstration purposes, we're returning mock data

    // Example SQL query (commented out):
    /*
    const { rows } = await sql`
      SELECT 
        category as name,
        SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as sucessos,
        SUM(CASE WHEN status = 'failure' THEN 1 ELSE 0 END) as falhas,
        SUM(CASE WHEN has_response = true THEN 1 ELSE 0 END) as respostas
      FROM campaign_results
      GROUP BY category
      ORDER BY category;
    `
    */

    // Mock data for demonstration
    const data = [{ name: "WhatsApp", sucessos: 312, falhas: 28, respostas: 203 }]

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
