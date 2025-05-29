"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageIcon, FileText, DollarSign } from "lucide-react"
import PricesSection from "@/components/file-sections/prices-section"
import CatalogsSection from "@/components/file-sections/catalogs-section"
import ImagesSection from "@/components/file-sections/images-section"

export default function FileManager() {
  const [activeSection, setActiveSection] = useState("images")

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">Gerenciamento de Arquivos</h2>
        <p className="text-slate-600">Gerencie suas imagens, catálogos e planilhas de preços</p>
      </div>

      <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="images" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Imagens
          </TabsTrigger>
          <TabsTrigger value="catalogs" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Catálogos
          </TabsTrigger>
          <TabsTrigger value="prices" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Preços
          </TabsTrigger>
        </TabsList>

        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Gerenciar Imagens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImagesSection />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="catalogs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Gerenciar Catálogos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CatalogsSection />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prices">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Gerenciar Preços
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PricesSection />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
