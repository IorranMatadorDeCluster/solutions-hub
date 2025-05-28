"use client"

import { useState, useEffect, ChangeEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RefreshCcw, Download, Upload } from "lucide-react"
import { fetchDashboardData } from "@/lib/data-service"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface Client {
  name: string;
  number: string;
}

interface PayloadFormat {
  activate: Client[];
}

export default function DashboardCharts() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [chartType, setChartType] = useState("bar")

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const result = await fetchDashboardData()
        setData(result)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleRefresh = async () => {
    setLoading(true)
    try {
      const result = await fetchDashboardData()
      setData(result)
    } catch (error) {
      console.error("Failed to refresh dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Export CSV handler
  const handleDownloadCSV = () => {
    if (!data || data.length === 0) {
      alert("Nenhum dado disponível para exportar.");
      return;
    }
    const whatsappData = data[0];
    const csvRows = [
      ["Métrica", "Valor"],
      ["Sucessos", whatsappData.sucessos],
      ["Falhas", whatsappData.falhas],
      ["Respostas", whatsappData.respostas],
      ["Total de Mensagens", whatsappData.sucessos + whatsappData.falhas]
    ];
    const csvContent = csvRows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "whatsapp-metricas.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

const handleUploadCSV = async (event: ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Check if it's a CSV file
  if (!file.name.endsWith('.csv')) {
    alert('Por favor, selecione um arquivo CSV válido.');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }

    alert('Arquivo processado com sucesso!');
    event.target.value = '';

  } catch (error) {
    console.error('Upload error:', error);
    alert(error instanceof Error ? error.message : 'Erro ao fazer upload do arquivo');
  }
};


  // Prepare data for pie chart
  const preparePieData = () => {
    if (!data) return []

    return [
      { name: "Sucessos", value: data[0].sucessos },
      { name: "Falhas", value: data[0].falhas },
      { name: "Respostas", value: data[0].respostas },
    ]
  }

  // Prepare data for bar chart
  const prepareBarData = () => {
    if (!data) return []

    return [
      { name: "Sucessos", value: data[0].sucessos },
      { name: "Falhas", value: data[0].falhas },
      { name: "Respostas", value: data[0].respostas },
    ]
  }

  const COLORS = ["#4ade80", "#f87171", "#60a5fa"]

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mb-4"></div>
        <p className="text-slate-600">Carregando dados do WhatsApp...</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-64">
        <p className="text-slate-600">Nenhum dado disponível para WhatsApp.</p>
      </div>
    )
  }

  const whatsappData = data[0]
  const totalMessages = whatsappData.sucessos + whatsappData.falhas
  const successRate = ((whatsappData.sucessos / totalMessages) * 100).toFixed(1)
  const responseRate = ((whatsappData.respostas / whatsappData.sucessos) * 100).toFixed(1)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Resultados de WhatsApp</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => document.getElementById('csvUpload')?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Importar CSV
          </Button>
          <input
            id="csvUpload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleUploadCSV}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Taxa de Sucesso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-green-500">{successRate}%</div>
              <p className="text-sm text-slate-500 mt-1">
                {whatsappData.sucessos} de {totalMessages} mensagens
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Taxa de Resposta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-blue-500">{responseRate}%</div>
              <p className="text-sm text-slate-500 mt-1">
                {whatsappData.respostas} de {whatsappData.sucessos} mensagens
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total de Falhas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-red-500">{whatsappData.falhas}</div>
              <p className="text-sm text-slate-500 mt-1">
                {((whatsappData.falhas / totalMessages) * 100).toFixed(1)}% do total
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={chartType} onValueChange={setChartType} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto mb-6">
          <TabsTrigger value="bar">Barras</TabsTrigger>
          <TabsTrigger value="pie">Pizza</TabsTrigger>
        </TabsList>

        <TabsContent value="bar">
          <Card>
            <CardHeader>
              <CardTitle>Métricas de WhatsApp</CardTitle>
              <CardDescription>Visualização de sucessos, falhas e respostas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={prepareBarData()}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 20,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Quantidade" fill="#25D366">
                      {prepareBarData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pie">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Métricas</CardTitle>
              <CardDescription>Proporção entre sucessos, falhas e respostas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={preparePieData()}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {preparePieData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}`, ""]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes de WhatsApp</CardTitle>
          <CardDescription>Dados detalhados da campanha</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-200 px-4 py-2 text-left">Métrica</th>
                  <th className="border border-slate-200 px-4 py-2 text-left">Valor</th>
                  <th className="border border-slate-200 px-4 py-2 text-left">Porcentagem</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="border border-slate-200 px-4 py-2 font-medium text-green-600">Sucessos</td>
                  <td className="border border-slate-200 px-4 py-2">{whatsappData.sucessos}</td>
                  <td className="border border-slate-200 px-4 py-2">{successRate}%</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="border border-slate-200 px-4 py-2 font-medium text-red-600">Falhas</td>
                  <td className="border border-slate-200 px-4 py-2">{whatsappData.falhas}</td>
                  <td className="border border-slate-200 px-4 py-2">
                    {((whatsappData.falhas / totalMessages) * 100).toFixed(1)}%
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-slate-200 px-4 py-2 font-medium text-blue-600">Respostas</td>
                  <td className="border border-slate-200 px-4 py-2">{whatsappData.respostas}</td>
                  <td className="border border-slate-200 px-4 py-2">{responseRate}%</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="border border-slate-200 px-4 py-2 font-medium">Total de Mensagens</td>
                  <td className="border border-slate-200 px-4 py-2">{totalMessages}</td>
                  <td className="border border-slate-200 px-4 py-2">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
