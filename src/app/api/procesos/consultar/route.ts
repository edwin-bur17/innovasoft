import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const procesoId = searchParams.get("procesoId");

    if (!procesoId) {
      return NextResponse.json(
        { error: "ID del proceso es requerido" },
        { status: 400 }
      );
    }

    const proceso = await prisma.proceso.findUnique({
      where: { id: parseInt(procesoId) },
      include: {
        licencia: {
          include: {
            servicio: true,
          },
        },
      },
    });

    if (!proceso) {
      return NextResponse.json(
        { error: "Proceso no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      proceso: {
        id: proceso.id,
        estado: proceso.estado,
        fecha_inicio: proceso.fecha_inicio,
        fecha_fin: proceso.fecha_fin,
        resultado: proceso.resultado,
        error_mensaje: proceso.error_mensaje,
        licencia: {
          id: proceso.licencia.id,
          servicio: proceso.licencia.servicio.nombre,
        },
      },
    });
  } catch (error) {
    console.error("Error al consultar proceso:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
