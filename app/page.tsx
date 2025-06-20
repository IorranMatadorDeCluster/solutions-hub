"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, CheckCircle, AlertCircle, BarChart } from "lucide-react"
import { cn } from "@/lib/utils"
import DashboardCharts from "@/components/dashboard-charts"
import FileManager from "@/components/file-manager"

export default function Component() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [dragActive, setDragActive] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
      setUploadStatus("idle")
    } else if (selectedFile) {
      setUploadStatus("error")
      setFile(null)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadStatus("idle")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        setUploadStatus("success")
        setFile(null)
        // Automatically switch to the dashboard tab after successful upload
        setActiveTab("dashboard")
      } else {
        setUploadStatus("error")
      }
    } catch (error) {
      setUploadStatus("error")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Lateral Menu - Full height on the left */}
      <div className="w-64 flex-shrink-0 bg-white/70 backdrop-blur-sm shadow-lg">
        <div className="p-6 h-full flex flex-col">
          <h2 className="text-xl font-bold text-slate-900 mb-8 tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            SolutionsHub
          </h2>
          <h3 className="font-semibold text-slate-900 mb-4">Ferramentas</h3>
          <nav className="space-y-2 flex-1">
            <button
              onClick={() => setActiveTab("upload")}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                activeTab === "upload" ? "bg-slate-900 text-white" : "hover:bg-slate-100 text-slate-700",
              )}
            >
              <Upload className="h-5 w-5" />
              <div>
                <div className="font-medium">Upload CSV</div>
                <div className="text-xs opacity-75">Importar planilhas</div>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("dashboard")}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                activeTab === "dashboard" ? "bg-slate-900 text-white" : "hover:bg-slate-100 text-slate-700",
              )}
            >
              <BarChart className="h-5 w-5" />
              <div>
                <div className="font-medium">Dashboard</div>
                <div className="text-xs opacity-75">Métricas WhatsApp</div>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("files")}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                activeTab === "files" ? "bg-slate-900 text-white" : "hover:bg-slate-100 text-slate-700",
              )}
            >
              <FileText className="h-5 w-5" />
              <div>
                <div className="font-medium">Arquivos</div>
                <div className="text-xs opacity-75">Gerenciar conteúdo</div>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-3xl mx-auto">
          {activeTab === "upload" && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Upload CSV</h1>
                <p className="text-slate-600">Importe sua planilha abaixo para iniciar o disparo em massa</p>
              </div>

              <Card className="border-2 border-dashed border-slate-200 bg-white/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div
                    className={cn(
                      "relative rounded-lg border-2 border-dashed transition-colors duration-200 ease-in-out",
                      dragActive ? "border-blue-400 bg-blue-50" : "border-slate-300 hover:border-slate-400",
                      file && "border-green-400 bg-green-50",
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                      {file ? (
                        <>
                          <FileText className="h-12 w-12 text-green-500 mb-4" />
                          <p className="text-sm font-medium text-slate-900 mb-1">{file.name}</p>
                          <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                        </>
                      ) : (
                        <>
                          <Upload className="h-12 w-12 text-slate-400 mb-4" />
                          <p className="text-sm font-medium text-slate-900 mb-1">Drop your CSV file here</p>
                          <p className="text-xs text-slate-500">or click to browse</p>
                        </>
                      )}
                    </div>
                  </div>

                  {uploadStatus === "error" && (
                    <div className="mt-4 flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>Please select a valid CSV file</span>
                    </div>
                  )}

                  {uploadStatus === "success" && (
                    <div className="mt-4 flex items-center gap-2 text-green-600 text-sm">
                      <CheckCircle className="h-4 w-4" />
                      <span>File uploaded successfully!</span>
                    </div>
                  )}

                  <Button
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white"
                    size="lg"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload CSV
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                <p className="text-slate-600">Visualize as métricas de desempenho</p>
              </div>
              <Card className="bg-white/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <DashboardCharts />
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "files" && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Arquivos</h1>
                <p className="text-slate-600">Gerencie seus arquivos e conteúdos</p>
              </div>
              <Card className="bg-white/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <FileManager />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
