import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id_usuario, id_servicio, caducidad, estado } = body;

    if (!id_usuario || !id_servicio || !caducidad) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // Crear licencia
    const licencia = await prisma.licencia.create({
      data: {
        id_usuario,
        id_servicio,
        caducidad: new Date(caducidad),
        estado: estado ?? false,
      },
      include: {
        usuario: true,
        servicio: true,
      },
    });

    return NextResponse.json(licencia, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al registrar la licencia" },
      { status: 500 }
    );
  }
}
