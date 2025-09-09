import { RowDataPacket } from "mysql2";

export interface User extends RowDataPacket {
  usuario: string;
  pass: string;
  Nombre: string;
  fecha_ingreso: Date;
  tipo: number;
  sede: string;
  cliente: string;
}
