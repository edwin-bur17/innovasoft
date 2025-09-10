"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Power } from "lucide-react";

interface LogoutConfirmDialogProps {
  onLogout: () => Promise<void>;
}

export default function LogoutDialog({
  onLogout,
}: LogoutConfirmDialogProps) {
  return (
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
            Se cerrará tu sesión actual y deberás volver a iniciar sesión para
            acceder nuevamente al sistema.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="destructive" onClick={onLogout}>
            Sí, cerrar sesión
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
