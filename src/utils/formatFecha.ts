export const formatearFecha = (fecha: Date | string | null) => {
  if (!fecha) return "N/A";
  return new Date(fecha).toLocaleString("es-CO", {
    timeZone: "America/Bogota",
    dateStyle: "short",
    timeStyle: "medium",
  });
};
