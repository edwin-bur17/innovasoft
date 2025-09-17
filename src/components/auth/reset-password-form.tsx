"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, LockIcon, ArrowLeft, KeyIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ApiResponse {
  message?: string
  error?: string
  status: number
}

export default function ResetPasswordForm({ token }: { token: string }) {
  const [contrasena, setContrasena] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, contrasena }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Error al cambiar la contraseña");
        return;
      }

      toast.success(data.message);
      router.push("/login");
    } catch (error) {
      toast.error("Error enviando la nueva contraseña");
      console.error("Error:", error);
    }finally{
      setIsLoading(false)
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border border-gray-200 bg-white">
      <CardHeader className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Reestablecer Contraseña
          </h1>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="contraseña" className="text-gray-700 font-medium">
              Contraseña
            </Label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="contraseña"
                type={showPassword ? "text" : "password"}
                placeholder="Digita tu nueva contraseña"
                className="pl-10"
                required
                disabled={isLoading}
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="pt-2 space-y-4">
            <Button type="submit" variant="gradient" disabled={isLoading}>
              <div className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span>Validando ...</span>
                  </>
                ) : (
                  <>
                    <KeyIcon className="w-4 h-4" />
                    <span>Cambiar contraseña</span>
                  </>
                )}
              </div>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/login")}
              className="w-full"
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
