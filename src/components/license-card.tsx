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
import { Bot, Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";

interface LicenseCardProps {
  licencia: Licencia;
}

interface UploadResponse {
  success: boolean;
  proceso?: {
    id: number;
    archivo_path: string;
    fecha_subida: string;
  };
  error?: string;
}

export default function LicenseCard({ licencia }: LicenseCardProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [uploadMessage, setUploadMessage] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/plain") {
      setSelectedFile(file);
      setUploadStatus("idle");
      setUploadMessage("");
    } else {
      setSelectedFile(null);
      setUploadStatus("error");
      setUploadMessage("Por favor selecciona un archivo .txt válido");
    }
  };

  const handleUploadFile = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadStatus("idle");
    setUploadMessage("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("licenciaId", licencia.id.toString());

      const response = await fetch("/api/procesos/cargar-txt", {
        method: "POST",
        body: formData,
      });

      const result: UploadResponse = await response.json();

      if (result.success) {
        setUploadStatus("success");
        setUploadMessage("Archivo subido exitosamente");
        setSelectedFile(null);
        const fileInput = document.getElementById(
          "file-upload"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        console.log("Proceso creado:", result.proceso);
      } else {
        setUploadStatus("error");
        setUploadMessage(result.error || "Error al subir el archivo");
      }
    } catch (error) {
      console.error("Error:", error);
      setUploadStatus("error");
      setUploadMessage("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setIsUploading(false);
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
              disabled={isUploading}
            />
            <Upload className="h-4 w-4 text-muted-foreground" />
          </div>
          {selectedFile && uploadStatus === "idle" && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <FileText className="h-4 w-4" />
              <span>{selectedFile.name}</span>
            </div>
          )}
          {uploadStatus === "success" && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>{uploadMessage}</span>
            </div>
          )}
          {uploadStatus === "error" && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>{uploadMessage}</span>
            </div>
          )}
        </div>

        {/* Botón de activar */}
        <Button
          onClick={handleUploadFile}
          disabled={!selectedFile || isUploading}
          className="w-full"
        >
          {isUploading
            ? "Subiendo archivo..."
            : selectedFile
            ? "Activar"
            : "Selecciona un archivo para activar"}
        </Button>
      </CardContent>
    </Card>
  );
}
