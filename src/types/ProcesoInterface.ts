export type EstadoProceso =
  | "APAGADO"
  | "PROCESANDO"
  | "EJECUTANDO"
  | "COMPLETADO"
  | "ERROR"
  | "PAUSADO";

export interface Proceso {
  id: number;
  id_licencia: number;
  archivo_path: string;
  estado: EstadoProceso;
  // fecha_subida: Date;
  fecha_inicio: Date | null;
  fecha_fin: Date | null;
  resultado: string | null;
  error_mensaje: string | null;
  // progreso: number | null;
}

export interface ProcesoConLicencia extends Proceso {
  licencia: {
    id: number;
    servicio: string;
  };
}

export interface UploadResponse {
  success: boolean;
  proceso?: {
    id: number;
    archivo_path: string;
    // fecha_subida: Date;
    estado: EstadoProceso;
    fecha_inicio: Date | null;
    // progreso: number | null;
  };
  error?: string;
}

export interface ConsultaProcesoResponse {
  success: boolean;
  proceso?: ProcesoConLicencia;
  error?: string;
}

export interface ActualizarProcesoResponse {
  success: boolean;
  proceso?: Proceso;
  error?: string;
}
