"use client";

import { useRouter } from "next/navigation";
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
import { Bot, Power, User, Mail, Calendar } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const userData = {
  name: "Juan Pérez",
  email: "juan.perez@email.com",
  avatar: "/professional-avatar.png",
  joinDate: "Enero 2024",
  plan: "Pro",
};

const userBots = [
  {
    id: 1,
    name: "Nombre del bot",
    type: "tipo",
    status: "Activo",
    description: "Descripcipción del bot",
    // lastActivity: "Hace 2 horas",
  },
];

export default function DashboardClient() {
  const router = useRouter();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Activo":
        return "default";
      case "Inactivo":
        return "secondary";
      case "Pausado":
        return "outline";
      default:
        return "secondary";
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      await response.json();
      router.push("login");
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
              <User className="h-5 w-5" />
              Mi información:
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  // src={userData.avatar || "/placeholder.svg"}
                  alt={userData.name}
                />
                <AvatarFallback>
                  {userData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{userData.name}</h3>
                  <Badge variant="outline">{userData.plan}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {userData.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Miembro desde {userData.joinDate}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bots Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Mis Bots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {userBots.map((bot) => (
              <Card key={bot.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Bot className="h-8 w-8 text-primary" />
                    <Badge variant={getStatusVariant(bot.status)}>
                      {bot.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{bot.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {bot.type}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {bot.description}
                  </p>
                  {/* <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Activity className="h-3 w-3" />
                    {bot.lastActivity}
                  </div> */}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
