export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  tipos_archivo: string; 
  fecha_inicio: string | null;
  fecha_fin: string | null;
}

export interface Licencia {
  id: number;
  caducidad: string;
  estado: boolean;
  servicio: Servicio;
}

export interface User {
  id: number;
  nombre: string;
  usuario: string;
  correo: string;
  fecha_creacion: string;
  licencias: Licencia[];
}

