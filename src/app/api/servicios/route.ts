import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface ServicioBody {
  nombre: string;
  descripcion: string;
  fecha_inicio?: string; // opcional
  fecha_fin?: string; // opcional
  precio: number;
}

export async function POST(req: Request) {
  try {
    const body: ServicioBody = await req.json();
    const { nombre, descripcion, fecha_inicio, fecha_fin, precio } = body;

    // Validaciones
    if (!nombre || !descripcion || !precio) {
      return NextResponse.json(
        { message: "Nombre, descripción y precio son obligatorios" },
        { status: 400 }
      );
    }

    const newServicio = await prisma.servicio.create({
      data: {
        nombre,
        descripcion,
        precio,
        fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : null,
        fecha_fin: fecha_fin ? new Date(fecha_fin) : null,
      },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        fecha_inicio: true,
        fecha_fin: true,
        precio: true,
        fecha_creacion: true,
      },
    });

    return NextResponse.json(
      { message: "Servicio creado exitosamente", servicio: newServicio },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al registrar servicio:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
