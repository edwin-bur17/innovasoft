import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { User } from "@/types/auth/UserInterface";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuario y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // Agrega logs para debug
    console.log("🔄 Intentando conectar a la base de datos...");
    console.log("📊 Variables de entorno:", {
      host: process.env.DB_HOST ? "✅ SET" : "❌ NOT SET",
      user: process.env.DB_USER ? "✅ SET" : "❌ NOT SET",
      password: process.env.DB_PASS ? "✅ SET" : "❌ NOT SET",
      database: process.env.DB_NAME ? "✅ SET" : "❌ NOT SET",
      port: process.env.DB_PORT || "3306 (default)",
    });

    const [rows] = await db.query<User[]>(
      "SELECT * FROM login WHERE usuario = ?",
      [username]
    );

    if (rows.length === 0 || rows[0].pass !== password) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const user = rows[0];

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET no configurado en variables de entorno");
    }

    // Generar token
    const token = jwt.sign(
      {
        usuario: user.usuario,
        tipo: user.tipo,
        sede: user.sede,
        cliente: user.cliente,
      },
      JWT_SECRET,
      { expiresIn: "12h" }
    );

    (await cookies()).set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 12, // 12 horas
      path: "/",
    });

    return NextResponse.json(
      {
        message: "Login exitoso",
        user: {
          usuario: user.usuario,
          nombre: user.Nombre,
          fecha_ingreso: user.fecha_ingreso,
          tipo: user.tipo,
          sede: user.sede,
          cliente: user.cliente,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Error al procesar la solicitud de login",
        error: error,
      },
      { status: 500 }
    );
  }
}
