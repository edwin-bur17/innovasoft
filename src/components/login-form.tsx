"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, User, Lock, LogIn } from "lucide-react";
import { toast } from "sonner";

export function LoginForm() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, contrasena }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || "Error en inicio de sesión");
      } else {
        localStorage.setItem("userData", JSON.stringify(data.user));
        toast.success("Inicio de sesión exitoso");
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error de red en la solicitud");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border border-gray-200 bg-white">
      <CardHeader className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Iniciar Sesión
          </h1>
          <p className="text-gray-500 text-sm">Accede a tu cuenta</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-700 font-medium">
              Usuario
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="username"
                type="text"
                placeholder="Ingresa tu usuario"
                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 transition-colors duration-200"
                required
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium">
              Contraseña
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                className="pl-10 pr-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 transition-colors duration-200"
                required
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium py-2.5 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              <div className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Autenticando...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Iniciar Sesión</span>
                  </>
                )}
              </div>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
