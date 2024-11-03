// types/Interaction.ts
export interface Interaction {
  uid?: string; // ID único para la interacción
  leadID: string; // ID del lead asociado
  userID: string; // ID del usuario que realizó la interacción
  fecha: string  // Fecha de la interacción
  tipo: string; // Tipo de interacción (llamada, email, etc.)
  notas?: string; // Notas sobre la interacción
}

