import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashResetToken, hashPassword } from "@/utils/api/hash";

interface resetPasswordProps {
  token: string;
  contrasena: string;
}

export async function POST(req: Request) {
  try {
    const { token, contrasena }: resetPasswordProps = await req.json();

    if (!token || !contrasena) {
      return NextResponse.json(
        { message: "Token y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // Hasheamos el token recibido para compararlo con el almacenado en BD
    const resetToken = hashResetToken(token);

    // Buscar usuario con token válido y no expirado
    const usuario = await prisma.usuario.findFirst({
      where: {
        reset_token: resetToken,
        reset_expira: { gte: new Date() },
      },
    });

    if (!usuario) {
      return NextResponse.json({ error: "Token inválido o expirado" }, { status: 401 });
    }

    const hashedPassword = await hashPassword(contrasena);

    // Actualizar contraseña y limpiar token
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        contrasena: hashedPassword,
        reset_token: null,
        reset_expira: null,
      },
    });

    return NextResponse.json(
      { message: "Contraseña actualizada exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en reset-password:", error);
    return NextResponse.json(
      { error: "Error al procesar la actualización de la contraseña." },
      { status: 500 }
    );
  }
}
