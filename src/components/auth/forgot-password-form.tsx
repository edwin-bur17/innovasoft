"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail, ArrowLeft, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordForm() {
  const [correo, setCorreo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [enviado, setEnviado] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo }),
      });

      const data: { message?: string; error?: string } = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setEnviado(true);
      } else {
        toast.error(data.error || "Error al enviar el correo");
      }
    } catch (error) {
      toast.error("Error enviando correo");
      console.error("Error enviando correo:", error);
    } finally {
      setLoading(false);
      
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border border-gray-200 bg-white">
      <CardHeader className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Recuperar Contraseña</h1>
          <p className="text-gray-500 text-sm">
            Ingresa tu correo para recibir el enlace de recuperación
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="correo" className="text-gray-700 font-medium">
              Correo Electrónico
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="correo"
                type="email"
                placeholder="tucorreo@ejemplo.com"
                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 transition-colors duration-200"
                required
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                disabled={enviado || loading}
              />
            </div>
          </div>

          <div className="pt-2 space-y-4">
            <Button
              type="submit"
              disabled={loading || enviado}
              variant="gradient"
            >
              <div className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>
                      {enviado ? "Correo enviado" : "Enviar enlace de recuperación"}
                    </span>
                  </>
                )}
              </div>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/login")}
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio de sesión
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
