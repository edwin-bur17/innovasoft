import nodemailer from "nodemailer";

interface SendPasswordResetEmailParams {
  to: string;
  userName: string;
  resetUrl: string;
}

export async function sendPasswordResetEmail({
  to,
  userName,
  resetUrl,
}: SendPasswordResetEmailParams): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recuperación de contraseña</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; border: 1px solid #e9ecef;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c3e50; margin: 0; font-size: 24px;">Recuperación de contraseña</h1>
          </div>
          
          <div style="background-color: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="margin: 0 0 15px 0; font-size: 16px;">Hola <strong>${userName}</strong>,</p>
            
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #666;">
              Recibimos una solicitud para restablecer la contraseña de tu cuenta. 
              Haz clic en el botón de abajo para crear una nueva contraseña:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="display: inline-block; background-color: #007bff; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                Restablecer contraseña
              </a>
            </div>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #856404;">
                <strong>Importante:</strong> Este enlace expira en 10 minutos por razones de seguridad.
              </p>
            </div>
            
            <p style="margin: 15px 0 0 0; font-size: 14px; color: #666;">
              Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña no será modificada.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
            <p>© Innovasoft - Todos los derechos reservados</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Soporte Innovasoft" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: "Recuperación de contraseña - Innovasoft",
    html: htmlTemplate,
  });
}
