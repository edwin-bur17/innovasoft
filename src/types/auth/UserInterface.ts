import { RowDataPacket } from "mysql2";

export interface User extends RowDataPacket {
  usuario: string
  nombre: string
  correo:string
}
