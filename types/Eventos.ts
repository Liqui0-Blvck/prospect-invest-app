// types/Event.ts
export interface Evento {
  id?: string; // ID único para el evento (podrías generarlo con Firebase)
  titulo: string; // Título del evento
  descripcion?: string; // Descripción opcional del evento
  fecha: string
  hora: string; // Hora del evento
  lugar?: string; // Lugar donde se llevará a cabo el evento (opcional)
  estado?: string; // Estado del evento (programado, completado, cancelado)
  asistente?: string; // Nombre del asistente al evento
}
