"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/auth/UserInterface";
import LogoutDialog from "@/components/logout-dialog";
import UserCard from "@/components/user-card";
import LicenseCard from "@/components/license-card";

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

          <LogoutDialog onLogout={handleLogout} />
        </div>

        {/* User Info Card */}
        <UserCard userData={userData} />

        {/* Licencias Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Mis Licencias</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {userData?.licencias?.length ? (
              userData.licencias.map((licencia) => (
                <LicenseCard key={licencia.id} licencia={licencia} />
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
