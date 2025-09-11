import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface ServicioBody {
  nombre: string;
  descripcion: string;
  precio: number;
}

export async function POST(req: Request) {
  try {
    const body: ServicioBody = await req.json();
    const { nombre, descripcion, precio } = body;

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
      },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
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
