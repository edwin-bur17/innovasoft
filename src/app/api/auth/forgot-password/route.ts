import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";
import { hashResetToken } from "@/utils/api/hash";

interface Body {
  correo: string;
}

export async function POST(req: Request) {
  try {
    const { correo }: Body = await req.json();

    if (!correo) {
      return NextResponse.json({ error: "El correo es requerido" }, { status: 400 });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { correo },
    });

    if (!usuario || !usuario.estado) {
      return NextResponse.json(
        {
          message:
            "Si la información proporcionada es correcta, recibirás un correo con los pasos para recuperar tu cuenta.",
        },
        { status: 200 }
      );
    }

    const token = crypto.randomBytes(20).toString("hex");
    const resetToken = hashResetToken(token);

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        reset_token: resetToken,
        reset_expira: new Date(Date.now() + 1000 * 60 * 10),
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`;

    await sendPasswordResetEmail({
      to: usuario.correo,
      userName: usuario.nombre,
      resetUrl: resetUrl,
    });

    return NextResponse.json(
      {
        message:
          "Si la información proporcionada es correcta, recibirás un correo con los pasos para recuperar tu cuenta.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error en forgot-password:", error);
    return NextResponse.json(
      { error: "Error al procesar el envío del token de recuperación." },
      { status: 500 }
    );
  }
}
