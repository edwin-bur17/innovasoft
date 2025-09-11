import { useState, useEffect, useCallback } from "react";
import {
  ConsultaProcesoResponse,
  // ActualizarProcesoResponse,
  EstadoProceso,
} from "@/types/ProcesoInterface";
interface UseProcesoOptions {
  procesoId?: number;
  autoRefresh?: boolean;
  refreshInterval?: number; // en milisegundos
}
interface ProcesoState {
  id: number;
  estado: EstadoProceso;
  progreso: number | null;
  fecha_inicio: Date | null;
  fecha_fin: Date | null;
  resultado: string | null;
  error_mensaje: string | null;
  licencia: {
    id: number;
    servicio: string;
  };
}

export function useProceso(options: UseProcesoOptions = {}) {
  const { procesoId, autoRefresh = false, refreshInterval = 3000 } = options;

  const [proceso, setProceso] = useState<ProcesoState | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const consultarProceso = useCallback(
    async (id?: number) => {
      const targetId = id || procesoId;
      if (!targetId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/procesos/consultar?procesoId=${targetId}`
        );
        const result: ConsultaProcesoResponse = await response.json();

        if (result.success && result.proceso) {
          setProceso({
            id: result.proceso.id,
            estado: result.proceso.estado,
            progreso: result.proceso.progreso,
            fecha_inicio: result.proceso.fecha_inicio,
            fecha_fin: result.proceso.fecha_fin,
            resultado: result.proceso.resultado,
            error_mensaje: result.proceso.error_mensaje,
            licencia: result.proceso.licencia,
          });
        } else {
          setError(result.error || "Error al consultar proceso");
        }
      } catch (err) {
        setError("Error de conexión al consultar proceso");
        console.error("Error al consultar proceso:", err);
      } finally {
        setLoading(false);
      }
    },
    [procesoId]
  );

  // Auto-refresh cuando el proceso está procesando
  useEffect(() => {
    if (!autoRefresh || !procesoId || !proceso) return;

    if (proceso.estado === "PROCESANDO") {
      const interval = setInterval(() => {
        consultarProceso(procesoId);
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, procesoId, proceso, refreshInterval, consultarProceso]);

  // Cargar proceso inicial
  useEffect(() => {
    if (procesoId) {
      consultarProceso(procesoId);
    }
  }, [procesoId, consultarProceso]);

  return {
    proceso,
    loading,
    error,
    consultarProceso,
    refetch: () => consultarProceso(),
  };
}
