import { Ticket } from '@/types/ticket';

const API_URL = 'http://127.0.0.1:8000';

/* ============================
   USUARIO ACTUAL
============================ */
export async function getUsuarioActual(): Promise<any> {
  const res = await fetch(`${API_URL}/me`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('No autenticado');
  }

  return res.json();
}

/* ================= BACKEND ================= */
interface TicketBackend {
  id_ticket: number;
  asunto: string;
  prioridad: 'baja' | 'media' | 'alta';
  estado: 'abierto' | 'en_proceso' | 'cerrado';
  fecha_creacion: string;
}

/* ================= MAPPER ================= */
function mapTicket(t: TicketBackend): Ticket {
  return {
    id: String(t.id_ticket),
    asunto: t.asunto,
    descripcion: '',
    prioridad:
      t.prioridad.charAt(0).toUpperCase() +
      t.prioridad.slice(1) as Ticket['prioridad'],

    estado:
      t.estado === 'en_proceso'
        ? 'En Progreso'
        : t.estado.charAt(0).toUpperCase() +
          t.estado.slice(1) as Ticket['estado'],

    fechaCreacion: new Date(t.fecha_creacion),
  };
}

/* ================= API ================= */
export async function getTickets(): Promise<Ticket[]> {
  const res = await fetch(`${API_URL}/tickets`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Error al obtener tickets');
  }

  const data: TicketBackend[] = await res.json();
  return data.map(mapTicket);
}

export async function crearTicket(data: {
  id_usuario: number;
  asunto: string;
  prioridad: 'baja' | 'media' | 'alta';
}) {
  const params = new URLSearchParams({
    id_usuario: String(data.id_usuario),
    asunto: data.asunto,
    prioridad: data.prioridad,
  });

  const res = await fetch(`${API_URL}/tickets?${params}`, {
    method: 'POST',
  });

  if (!res.ok) {
    throw new Error('Error al crear ticket');
  }

  return res.json();
}

export async function cambiarEstadoTicket(
  id: string,
  nuevoEstado: 'abierto' | 'en_proceso' | 'cerrado'
) {
  const res = await fetch(
    `${API_URL}/tickets/${id}/estado?nuevo_estado=${nuevoEstado}`,
    { method: 'PUT' }
  );

  if (!res.ok) {
    throw new Error('Error al cambiar estado');
  }

  return res.json();
}

import { Interaccion } from '@/types/interacciones';

export async function getHistorialTicket(
  idTicket: string
): Promise<Interaccion[]> {
  const res = await fetch(
    `${API_URL}/tickets/${idTicket}/historial`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error('Error al obtener historial');
  }

  return res.json();
}



