"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Upload, Trash2, Edit3, Download, FileSpreadsheet } from "lucide-react"
import { cn } from "@/lib/utils"

interface PriceFile {
  name: string
  url: string
  size: number
  lastModified: string
  type: string
}

export default function PricesSection() {
  const [prices, setPrices] = useState<PriceFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("")
  const [editingPrice, setEditingPrice] = useState<PriceFile | null>(null)
  const [newName, setNewName] = useState("")
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    loadPrices()
  }, [])

  const loadPrices = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/files/prices")
      if (response.ok) {
        const data = await response.json()
        setPrices(data.files)
      }
    } catch (error) {
      console.error("Error loading prices:", error)
    } finally {
      setLoading(false)
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
      const file = e.dataTransfer.files[0]
      if (isValidPriceFile(file)) {
        setSelectedFile(file)
        setFileName(file.name.split(".")[0])
      }
    }
  }

  const isValidPriceFile = (file: File) => {
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]
    return validTypes.includes(file.type) || file.name.endsWith(".csv")
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (isValidPriceFile(file)) {
        setSelectedFile(file)
        setFileName(file.name.split(".")[0])
      }
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !fileName.trim()) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("fileName", fileName.trim())

      const response = await fetch("/api/files/prices/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        await loadPrices()
        setSelectedFile(null)
        setFileName("")
      }
    } catch (error) {
      console.error("Error uploading price file:", error)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (priceName: string) => {
    try {
      const response = await fetch(`/api/files/prices/${encodeURIComponent(priceName)}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await loadPrices()
      }
    } catch (error) {
      console.error("Error deleting price file:", error)
    }
  }

  const handleRename = async () => {
    if (!editingPrice || !newName.trim()) return

    try {
      const response = await fetch(`/api/files/prices/${encodeURIComponent(editingPrice.name)}/rename`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newName: newName.trim() }),
      })

      if (response.ok) {
        await loadPrices()
        setEditingPrice(null)
        setNewName("")
      }
    } catch (error) {
      console.error("Error renaming price file:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="border-2 border-dashed border-slate-200">
        <CardContent className="p-6">
          <div
            className={cn(
              "relative rounded-lg border-2 border-dashed transition-colors duration-200 ease-in-out",
              dragActive ? "border-blue-400 bg-blue-50" : "border-slate-300 hover:border-slate-400",
              selectedFile && "border-green-400 bg-green-50",
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Input
              type="file"
              accept=".csv,.xls,.xlsx"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              {selectedFile ? (
                <>
                  <FileSpreadsheet className="h-8 w-8 text-green-500 mb-2" />
                  <p className="text-sm font-medium text-slate-900">{selectedFile.name}</p>
                  <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-slate-400 mb-2" />
                  <p className="text-sm font-medium text-slate-900">Arraste uma planilha aqui</p>
                  <p className="text-xs text-slate-500">CSV, XLS ou XLSX</p>
                </>
              )}
            </div>
          </div>

          {selectedFile && (
            <div className="mt-4 space-y-3">
              <div>
                <Label htmlFor="fileName">Nome do arquivo</Label>
                <Input
                  id="fileName"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Digite o nome do arquivo"
                />
              </div>
              <Button onClick={handleUpload} disabled={uploading || !fileName.trim()} className="w-full">
                {uploading ? "Enviando..." : "Enviar Planilha"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Prices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prices.map((price) => (
          <Card key={price.name} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-4">
                <FileSpreadsheet className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="font-medium text-sm truncate mb-2">{price.name}</h3>
              <p className="text-xs text-slate-500 mb-4">
                {price.size > 1024 * 1024
                  ? `${(price.size / 1024 / 1024).toFixed(2)} MB`
                  : `${(price.size / 1024).toFixed(1)} KB`}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <a href={price.url} target="_blank" rel="noopener noreferrer">
                    <Download className="h-3 w-3" />
                  </a>
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setEditingPrice(price)
                        setNewName(price.name.split(".")[0])
                      }}
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Renomear Planilha</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="newName">Novo nome</Label>
                        <Input
                          id="newName"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="Digite o novo nome"
                        />
                      </div>
                      <Button onClick={handleRename} className="w-full">
                        Renomear
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-red-600 hover:text-red-700"
                  onClick={() => handleDelete(price.name)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {prices.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-500">Nenhuma planilha encontrada. Faça upload da primeira planilha!</p>
        </div>
      )}
    </div>
  )
}
