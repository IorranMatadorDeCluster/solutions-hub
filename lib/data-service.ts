"use server"

export async function fetchDashboardData() {
  try {
    // This is where you would execute your SQL query to fetch the data
    // For demonstration purposes, we're returning mock data
    // In a real application, you would use the SQL query to fetch data from your database

    // Example SQL query (commented out):
    /*
    const { rows } = await sql`
      SELECT 
        'WhatsApp' as name,
        SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as sucessos,
        SUM(CASE WHEN status = 'failure' THEN 1 ELSE 0 END) as falhas,
        SUM(CASE WHEN has_response = true THEN 1 ELSE 0 END) as respostas
      FROM campaign_results
      WHERE channel = 'whatsapp'
    `
    return [rows];
    */

    // Mock data for demonstration - only WhatsApp data
    return [{ name: "WhatsApp", sucessos: 312, falhas: 28, respostas: 203 }]
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    throw new Error("Failed to fetch dashboard data")
  }
}
