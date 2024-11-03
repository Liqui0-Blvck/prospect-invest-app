// types/Lead.ts
export interface Lead {
  id?: string; // ID único para el lead (podrías generarlo con Firebase)
  nombre: string; // Nombre del lead
  numeroTelefono: string; // Número de teléfono
  email: string; // Dirección de correo electrónico
  estado?: string; // Estado del lead (interesado, desinteresado, frío, caliente)
  fechaCreacion?: string; // Fecha en que se creó el lead
  fechaUltimaInteraccion?: string; // Fecha de la última interacción
  notas?: string; // Notas adicionales sobre el lead
  fuente?: string; // Fuente de dónde proviene el lead (publicidad, referencia, etc.)
}

// Enum para los posibles estados de los leads
export enum LeadEstado {
  INTERESADO = 'interesado',
  DESINTERESADO = 'desinteresado',
  FRIO = 'frío',
  CALIENTE = 'caliente',
}
