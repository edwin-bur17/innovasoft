import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

interface RegisterBody {
  nombre: string;
  usuario: string;
  contrasena: string;
  correo: string;
}

export async function POST(req: Request) {
  try {
    const body: RegisterBody = await req.json();
    const { nombre, usuario, contrasena, correo } = body;

    // Validación básica
    if (!nombre || !usuario || !contrasena || !correo) {
      return NextResponse.json(
        { message: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    // Verificar si ya existe usuario o correo
    const existingUser = await prisma.usuario.findFirst({
      where: {
        OR: [{ usuario }, { correo }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "El usuario o correo ya existe" },
        { status: 409 }
      );
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Crear usuario
    const newUser = await prisma.usuario.create({
      data: {
        nombre,
        usuario,
        contrasena: hashedPassword,
        correo,
      },
      select: {
        id: true,
        nombre: true,
        usuario: true,
        correo: true,
        estado: true,
        fecha_creacion: true,
      },
    });

    return NextResponse.json(
      { message: "Usuario registrado exitosamente", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
