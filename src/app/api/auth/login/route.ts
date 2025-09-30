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

    if (!user.estado) {
      return NextResponse.json(
        { message: "El usuario no está activo, contacta con el administrador." },
        { status: 403 }
      );
    }

    // // Verificar si ya tiene sesión activa
    // if (user.sesion_token && user.sesion_expira && user.sesion_expira > new Date()) {
    //   try {
    //     jwt.verify(user.sesion_token, JWT_SECRET);

    //     // Si llegamos aquí, el token es válido y la sesión está activa
    //     return NextResponse.json(
    //       {
    //         message:
    //           "Ya tienes una sesión activa. Solo se permite una sesión a la vez.",
    //         error: "SESION_ACTIVA",
    //       },
    //       { status: 409 }
    //     );
    //   } catch (jwtError) {
    //     console.error(jwtError)
    //     await prisma.usuario.update({
    //       where: { id: user.id },
    //       data: { sesion_token: null, sesion_expira: null },
    //     });
    //   }
    // }

    // Crear nuevo token y actualizar sesión
    const token = jwt.sign(
      { id: user.id, usuario: user.usuario, correo: user.correo },
      JWT_SECRET,
      { expiresIn: "12h" }
    );

    const sesionExpira = new Date(Date.now() + 1000 * 60 * 60 * 12);

    await prisma.usuario.update({
      where: { id: user.id },
      data: {
        sesion_token: token,
        sesion_expira: sesionExpira,
      },
    });

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

    const isProd = process.env.NODE_ENV === "production";

    response.cookies.set("session", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 12, // 12 horas
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
    });

    return response;
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
