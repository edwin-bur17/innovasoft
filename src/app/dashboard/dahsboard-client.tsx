"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/auth/UserInterface";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bot, Power, User2, Mail, Calendar } from "lucide-react";

export default function DashboardClient() {
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      await response.json();
      localStorage.removeItem("userData");
      router.push("/login");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Gestiona tus bots</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-2">
                <Power className="h-4 w-4" />
                Cerrar sesión
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>¿Cerrar sesión?</DialogTitle>
                <DialogDescription>
                  Se cerrará tu sesión actual y deberás volver a iniciar sesión
                  para acceder nuevamente al sistema.
                </DialogDescription>
              </DialogHeader>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="destructive" onClick={handleLogout}>
                  Sí, cerrar sesión
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* User Info Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User2 className="h-5 w-5" />
              Mi información:
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage alt={userData?.nombre} />
                <AvatarFallback>
                  {userData?.nombre
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{userData?.nombre}</h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {userData?.correo}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Miembro desde{" "}
                    {userData?.fecha_creacion
                      ? new Date(userData.fecha_creacion).toLocaleDateString()
                      : "No disponible"}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Licencias Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Mis Licencias</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {userData?.licencias?.length ? (
              userData.licencias.map((licencia) => (
                <Card
                  key={licencia.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Bot className="h-8 w-8 text-primary" />
                      <Badge
                        variant={licencia.estado ? "default" : "secondary"}
                      >
                        {licencia.estado ? "Activa" : "Inactiva"}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">
                      {licencia.servicio.nombre}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {licencia.servicio.descripcion}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Caduca el{" "}
                      {new Date(licencia.caducidad).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      Precio: ${licencia.servicio.precio}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground">No tienes licencias aún</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
