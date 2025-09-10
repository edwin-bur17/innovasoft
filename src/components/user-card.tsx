"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User2, Mail, Calendar } from "lucide-react";
import { User } from "@/types/auth/UserInterface";

interface UserInfoCardProps {
  userData: User | null;
}

export default function UserCard({ userData }: UserInfoCardProps) {
  // Si userData es null, mostrar un skeleton o estado de carga
  if (!userData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User2 className="h-5 w-5" />
            Mi información:
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
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
            <AvatarImage alt={userData.nombre} />
            <AvatarFallback>
              {userData.nombre
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{userData.nombre}</h3>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {userData.correo}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Miembro desde{" "}
                {userData.fecha_creacion
                  ? new Date(userData.fecha_creacion).toLocaleDateString()
                  : "No disponible"}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
