import { NextRequest, NextResponse } from "next/server";
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

    if (file.type !== "text/plain") {
      return NextResponse.json(
        { error: "Solo se permiten archivos .txt" },
        { status: 400 }
      );
    }

    const licencia = await prisma.licencia.findUnique({
      where: { id: parseInt(licenciaId) },
    });

    if (!licencia) {
      return NextResponse.json(
        { error: "Licencia no encontrada" },
        { status: 404 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Subir a Cloudinary tipado
    const uploadResult: UploadApiResponse = await new Promise(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "raw",
              folder: "innovabot",
              public_id: `archivo-${licenciaId}-${Date.now()}`,
            },
            (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
              if (error) reject(error);
              else if (result) resolve(result);
            }
          )
          .end(buffer);
      }
    );

    const proceso = await prisma.proceso.create({
      data: {
        id_licencia: parseInt(licenciaId),
        archivo_path: uploadResult.secure_url,
      },
    });

    return NextResponse.json({
      success: true,
      proceso: {
        id: proceso.id,
        archivo_path: proceso.archivo_path,
        fecha_subida: proceso.fecha_subida,
      },
    });
  } catch (error) {
    console.error("Error al subir archivo txt (licencia):", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
