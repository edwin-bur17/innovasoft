import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password, name, phone } = body;

    if (!username || !email || !password || !name) {
      return NextResponse.json(
        { error: "Todos los campos obligatorios deben ser enviados" },
        { status: 400 }
      );
    }

    // Verificar si ya existe el usuario o email
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El usuario o correo ya está registrado" },
        { status: 409 }
      );
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        name,
        phone,
        active: true,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        phone: true,
        active: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: "Usuario registrado exitosamente", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
