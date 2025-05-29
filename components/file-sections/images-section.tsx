"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Upload, Trash2, Edit3, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageFile {
  name: string
  url: string
  size: number
  lastModified: string
  type: string
}


export default function ImagesSection() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("")
  const [editingImage, setEditingImage] = useState<ImageFile | null>(null)
  const [newName, setNewName] = useState("")
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/files/images")
      if (!response.ok) {
        throw new Error('Failed to fetch images')
      }
      const data = await response.json()
      if (data.success && Array.isArray(data.data)) {
        setImages(data.data)
      }
    } catch (error) {
      console.error("Error loading images:", error)
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
      if (file.type.startsWith("image/")) {
        setSelectedFile(file)
        setFileName(file.name.split(".")[0])
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setFileName(file.name.split(".")[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !fileName.trim()) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("fileName", fileName.trim())
      formData.append("fileType", selectedFile.type)

      const response = await fetch("/api/files/images/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload image')
      }

      await loadImages()
      setSelectedFile(null)
      setFileName("")
    } catch (error: any) {
      console.error("Error uploading image:", error)
      alert(error.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (imageName: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      const response = await fetch(`/api/files/images/${encodeURIComponent(imageName)}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete image')
      }

      await loadImages()
    } catch (error: any) {
      console.error("Error deleting image:", error)
      alert(error.message || 'Failed to delete image')
    }
  }

const handleRename = async () => {
    if (!editingImage || !newName.trim()) return

    try {
      const response = await fetch(`/api/files/images/${encodeURIComponent(editingImage.name)}/rename`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newName: newName.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to rename image')
      }

      await loadImages()
      setEditingImage(null)
      setNewName("")
    } catch (error: any) {
      console.error("Error renaming image:", error)
      alert(error.message || 'Failed to rename image')
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
              accept="image/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              {selectedFile ? (
                <>
                  <Eye className="h-8 w-8 text-green-500 mb-2" />
                  <p className="text-sm font-medium text-slate-900">{selectedFile.name}</p>
                  <p className="text-xs text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-slate-400 mb-2" />
                  <p className="text-sm font-medium text-slate-900">Arraste uma imagem aqui</p>
                  <p className="text-xs text-slate-500">ou clique para selecionar</p>
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
                {uploading ? "Enviando..." : "Enviar Imagem"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {images.map((image) => (
          <Card key={image.name} className="overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={image.url || "/placeholder.svg"}
                alt={image.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <CardContent className="p-3">
              <h3 className="font-medium text-sm truncate mb-2">{image.name}</h3>
              <p className="text-xs text-slate-500 mb-3">{(image.size / 1024 / 1024).toFixed(2)} MB</p>
              <div className="flex gap-1">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>{image.name}</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center">
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={image.name}
                        className="max-w-full max-h-[70vh] object-contain"
                      />
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setEditingImage(image)
                        setNewName(image.name.split(".")[0])
                      }}
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Renomear Imagem</DialogTitle>
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
                  onClick={() => handleDelete(image.name)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-500">Nenhuma imagem encontrada. Faça upload da primeira imagem!</p>
        </div>
      )}
    </div>
  )
}
