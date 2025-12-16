export type TicketStatus =
  | 'Abierto'
  | 'En Progreso'
  | 'Cerrado';

export type TicketPriority =
  | 'Baja'
  | 'Media'
  | 'Alta';

export interface Ticket {
  id: string;
  asunto: string;
  descripcion: string;
  prioridad: TicketPriority;
  estado: TicketStatus;
  fechaCreacion: Date;
}

export type UserRole = 'admin' | 'operador' | 'cliente';

export interface User {
  id: number;
  nombre: string;
  rol: UserRole;
}
