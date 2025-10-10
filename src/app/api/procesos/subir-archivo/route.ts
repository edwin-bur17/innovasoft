import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import { prisma } from "@/lib/prisma";

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const licenciaId = formData.get("licenciaId") as string;

    if (!file || !licenciaId) {
      return NextResponse.json(
        { error: "Archivo y ID de licencia son requeridos" },
        { status: 400 }
      );
    }

    // Obtener licencia con relaciones
    const licencia = await prisma.licencia.findUnique({
      where: { id: parseInt(licenciaId) },
      include: {
        usuario: true,
        servicio: true,
      },
    });

    if (!licencia) {
      return NextResponse.json({ error: "Licencia no encontrada" }, { status: 404 });
    }

    // Validar tipo de archivo
    const extension = file.name.split(".").pop()?.toLowerCase();
    const tiposPermitidos = licencia.servicio.tipos_archivo
      .split(",")
      .map((tipo) => tipo.trim().toLowerCase().replace(".", ""));

    if (!extension || !tiposPermitidos.includes(extension)) {
      return NextResponse.json(
        { error: `Solo se permiten archivos ${licencia.servicio.tipos_archivo}` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Estructura de la carpeta
    const folderPath = `innovabot/cliente_${licencia.usuario.id}/servicio_${licencia.servicio.id}`;

    // Subir a Cloudinary
    const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "raw",
            folder: folderPath,
            public_id: `${Date.now()}-${file.name}`,
          },
          (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
            if (error) reject(error);
            else if (result) resolve(result);
          }
        )
        .end(buffer);
    });

    // Crear proceso
    const proceso = await prisma.proceso.create({
      data: {
        id_licencia: parseInt(licenciaId),
        archivo_path: uploadResult.secure_url,
        estado: "PROCESANDO",
        fecha_inicio: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      proceso: {
        id: proceso.id,
        archivo_path: proceso.archivo_path,
        estado: proceso.estado,
        fecha_inicio: proceso.fecha_inicio,
      },
    });
  } catch (error) {
    console.error("Error al subir archivo txt (licencia):", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
