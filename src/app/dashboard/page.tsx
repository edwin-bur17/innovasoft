import React from "react";
import DashboardClient from "./dahsboard-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Panel de control de la aplicación",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
