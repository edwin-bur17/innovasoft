import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

interface LoginBody {
  usuario: string;
  contrasena: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export async function POST(req: Request) {
  try {
    const body: LoginBody = await req.json();
    const { usuario, contrasena } = body;

    if (!usuario || !contrasena) {
      return NextResponse.json(
        { message: "Usuario y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    const user = await prisma.usuario.findUnique({
      where: { usuario },
      include: {
        licencias: {
          include: { servicio: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Usuario o contraseña inválidos" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Usuario o contraseña inválidos" },
        { status: 401 }
      );
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: user.id, usuario: user.usuario, correo: user.correo },
      JWT_SECRET,
      { expiresIn: "12h" }
    );

    const response = NextResponse.json(
      {
        message: "Login exitoso",
        user: {
          id: user.id,
          nombre: user.nombre,
          usuario: user.usuario,
          correo: user.correo,
          fecha_creacion: user.fecha_creacion,
          licencias: user.licencias,
        },
      },
      { status: 200 }
    );

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
