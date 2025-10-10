"use client";
import { Licencia } from "@/types/auth/UserInterface";
import { UploadResponse, EstadoProceso } from "@/types/ProcesoInterface";
import { useState, useEffect } from "react";
import { useProceso } from "@/hooks/useProceso";
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
import {
  Bot,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  PlayCircle,
  StopCircle,
  Clock,
} from "lucide-react";
import LoadingBar from "./loading-bar";
import { formatearFecha } from "@/utils/formatFecha";

interface LicenseCardProps {
  licencia: Licencia;
}

type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success";

export default function LicenseCard({ licencia }: LicenseCardProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [uploadMessage, setUploadMessage] = useState<string>("");
  const [currentProcesoId, setCurrentProcesoId] = useState<number | null>(null);
  const [showProceso, setShowProceso] = useState(true);

  // Usar el hook personalizado
  const {
    proceso: procesoActual,
    loading: isConsultingProcess,
    error: procesoError,
  } = useProceso({
    procesoId: currentProcesoId || undefined,
    autoRefresh: true,
    refreshInterval: 15000, // 15 segundos
  });

  // Limpiar mensajes luego de cierto tiempo
  useEffect(() => {
    if (uploadStatus === "success" || uploadStatus === "error") {
      const timer = setTimeout(() => {
        setUploadStatus("idle");
        setUploadMessage("");
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [uploadStatus]);

  useEffect(() => {
    if (
      procesoActual &&
      (procesoActual.estado === "COMPLETADO" || procesoActual.estado === "ERROR")
    ) {
      const timer = setTimeout(() => {
        setShowProceso(false);
      }, 15000);

      return () => clearTimeout(timer);
    } else {
      // Si el estado cambia a otro, lo volvemos a mostrar
      setShowProceso(true);
    }
  }, [procesoActual]);

  // Mostrar errores del proceso si los hay
  useEffect(() => {
    if (procesoError) {
      console.error("Error en proceso:", procesoError);
    }
  }, [procesoError]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const tiposPermitidos = licencia.servicio.tipos_archivo
      .split(",")
      .map((tipo) => tipo.trim().toLowerCase());

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension && tiposPermitidos.includes(`.${extension}`)) {
      setSelectedFile(file);
      setUploadStatus("idle");
      setUploadMessage("");
    } else {
      setSelectedFile(null);
      setUploadStatus("error");
      setUploadMessage(
        `Por favor selecciona un archivo válido (${licencia.servicio.tipos_archivo})`
      );
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

      const response = await fetch("/api/procesos/subir-archivo", {
        method: "POST",
        body: formData,
      });

      const result: UploadResponse = await response.json();
      
      if (result.success && result.proceso) {
        setUploadStatus("success");
        setUploadMessage("Archivo subido exitosamente");
        setSelectedFile(null);
        const fileInput = document.getElementById(
          `file-upload-${licencia.id}`
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        // Establecer el ID del proceso para que el hook lo monitoree
        setCurrentProcesoId(result.proceso.id);
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

  const getEstadoBadge = (estado: EstadoProceso) => {
    const estadoConfig: Record<EstadoProceso, { variant: BadgeVariant; label: string }> =
      {
        APAGADO: { variant: "secondary", label: "Apagado" },
        PROCESANDO: { variant: "default", label: "Procesando" },
        EJECUTANDO: { variant: "default", label: "En ejecución" },
        COMPLETADO: { variant: "success", label: "Completado" },
        ERROR: { variant: "destructive", label: "Error" },
        PAUSADO: { variant: "outline", label: "Pausado" },
      };

    const config = estadoConfig[estado];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getEstadoIcon = (estado: EstadoProceso) => {
    switch (estado) {
      case "PROCESANDO":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "EJECUTANDO":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "COMPLETADO":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "ERROR":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "PAUSADO":
        return <StopCircle className="h-4 w-4 text-yellow-600" />;
      case "APAGADO":
        return <Clock className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Bot className="h-8 w-8 text-primary" />
          <Badge variant={licencia.estado ? "secondary" : "secondary"}>
            {licencia.estado ? "Activa" : "Inactiva"}
          </Badge>
        </div>
        <CardTitle className="text-lg">{licencia.servicio.nombre}</CardTitle>
        <CardDescription className="text-sm">
          {licencia.servicio.descripcion}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estado del proceso actual */}
        {procesoActual && showProceso && (
          <div className="bg-gray-50 p-3 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Estado del Proceso:</span>
              <div className="flex items-center gap-2">
                {getEstadoIcon(procesoActual.estado)}
                {getEstadoBadge(procesoActual.estado)}
                {isConsultingProcess && (
                  <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
                )}
              </div>
            </div>
            {procesoActual &&
              (procesoActual.estado === "PROCESANDO" ||
                procesoActual.estado === "EJECUTANDO") && (
                <div className="space-y-1">
                  <LoadingBar />
                </div>
              )}

            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>
                <span className="font-medium">Inicio:</span>
                <br />
                {formatearFecha(procesoActual.fecha_inicio)}
              </div>
              <div>
                <span className="font-medium">Fin:</span>
                <br />
                {formatearFecha(procesoActual.fecha_fin)}
              </div>
            </div>

            {procesoActual.error_mensaje && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                <strong>Error:</strong> {procesoActual.error_mensaje}
              </div>
            )}

            {procesoActual.resultado && procesoActual.estado === "COMPLETADO" && (
              <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                <strong>Resultado:</strong> {procesoActual.resultado}
              </div>
            )}
          </div>
        )}

        {/* Input de archivo */}
        {(!procesoActual ||
          procesoActual.estado === "APAGADO" ||
          procesoActual.estado === "ERROR" ||
          procesoActual.estado === "COMPLETADO") && (
          <>
            <div className="space-y-2">
              <Label
                htmlFor={`file-upload-${licencia.id}`}
                className="text-sm font-medium"
              >
                Subir archivo:
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id={`file-upload-${licencia.id}`}
                  type="file"
                  accept={licencia.servicio.tipos_archivo}
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

            <Button
              onClick={handleUploadFile}
              disabled={!selectedFile || isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subiendo archivo...
                </>
              ) : selectedFile ? (
                <>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Activar
                </>
              ) : (
                "Selecciona un archivo para activar"
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
