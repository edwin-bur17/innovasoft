"use client";
import { Licencia } from "@/types/auth/UserInterface";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot, Upload, FileText } from "lucide-react";

interface LicenseCardProps {
  licencia: Licencia;
}

export default function LicenseCard({ licencia }: LicenseCardProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/plain") {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      alert("Por favor selecciona un archivo .txt válido");
    }
  };

  const handleActivate = () => {
    if (selectedFile) {
      // Aquí iría la lógica para activar/iniciar con el archivo
      console.log("Iniciando con archivo:", selectedFile.name);
      // Ejemplo de lectura del archivo:
      // const reader = new FileReader();
      // reader.onload = (e) => {
      //   const content = e.target?.result;
      //   // Procesar contenido del archivo
      // };
      // reader.readAsText(selectedFile);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Bot className="h-8 w-8 text-primary" />
          <Badge variant={licencia.estado ? "default" : "secondary"}>
            {licencia.estado ? "Activa" : "Inactiva"}
          </Badge>
        </div>
        <CardTitle className="text-lg">{licencia.servicio.nombre}</CardTitle>
        <CardDescription className="text-sm">
          {licencia.servicio.descripcion}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Caduca el {new Date(licencia.caducidad).toLocaleDateString()}
        </p>
        <p className="text-sm">Precio: ${licencia.servicio.precio}</p>

        {/* Input de archivo */}
        <div className="space-y-2">
          <Label htmlFor="file-upload" className="text-sm font-medium">
            Subir archivo de configuración
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="file-upload"
              type="file"
              accept=".txt"
              onChange={handleFileChange}
              className="flex-1"
            />
            <Upload className="h-4 w-4 text-muted-foreground" />
          </div>
          {selectedFile && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <FileText className="h-4 w-4" />
              <span>{selectedFile.name}</span>
            </div>
          )}
        </div>

        {/* Botón de activar */}
        <Button
          onClick={handleActivate}
          disabled={!selectedFile}
          className="w-full"
        >
          {selectedFile ? "Activar" : "Selecciona un archivo para activar"}
        </Button>
      </CardContent>
    </Card>
  );
}
