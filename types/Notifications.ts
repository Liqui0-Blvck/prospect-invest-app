export interface Notification {
  id?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'reminder'; // Tipo de notificación
  body: string; // Cuerpo de la notificación
  read: boolean;
  userId: string; // Usuario al que está dirigida la notificación
  createdAt: string; // Fecha de creación
}
