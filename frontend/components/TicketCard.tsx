'use client';

import { useState } from 'react';
import { Ticket, TicketPriority, TicketStatus } from '@/types/ticket';
import { useAuth } from '@/context/AuthContext';

interface Props {
  ticket: Ticket;
  onUpdate?: (ticket: Ticket) => void;
}

export default function TicketCard({ ticket, onUpdate }: Props) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [ticketEditado, setTicketEditado] = useState<Ticket>(ticket);

  const { role } = useAuth();

  /* ===========================
     GUARDAR CAMBIOS
  =========================== */
  const handleGuardar = () => {
    onUpdate?.(ticketEditado);
    setEditando(false);
    setMostrarModal(false);
  };

  const handleCerrar = () => {
    const cerrado: Ticket = {
      ...ticketEditado,
      estado: 'Cerrado',
    };
    setTicketEditado(cerrado);
    onUpdate?.(cerrado);
    setMostrarModal(false);
  };

  /* ===========================
     COLORES (SIN TOCAR)
  =========================== */
  const estadoColors: Record<TicketStatus, string> = {
    Abierto: 'bg-green-100 text-green-700',
    'En Progreso': 'bg-blue-100 text-blue-700',
    Cerrado: 'bg-gray-100 text-gray-700',
    /*Rechazado: 'bg-red-100 text-red-700',*/
  };

  const prioridadColors: Record<TicketPriority, string> = {
    Baja: 'bg-slate-100 text-slate-700',
    Media: 'bg-yellow-100 text-yellow-700',
    Alta: 'bg-orange-100 text-orange-700',
    /*Urgente: 'bg-red-100 text-red-700',*/
  };

  return (
    <>
      {/* ===========================
          CARD
      =========================== */}
      <div
        onClick={() => setMostrarModal(true)}
        className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition cursor-pointer"
      >
        <div className="flex gap-2 mb-3">
          <span
            className={`px-3 py-1 text-xs rounded-full ${estadoColors[ticket.estado]}`}
          >
            {ticket.estado}
          </span>
          <span
            className={`px-3 py-1 text-xs rounded-full ${prioridadColors[ticket.prioridad]}`}
          >
            {ticket.prioridad}
          </span>
        </div>

        <h3 className="font-semibold text-slate-800">
          {ticket.asunto}
        </h3>
      </div>

      {/* ===========================
          MODAL (FONDO CORREGIDO)
      =========================== */}
      {mostrarModal && (
        <div
          className="fixed inset-0 bg-slate-100/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setMostrarModal(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">
              {editando ? '✏️ Editar Ticket' : '🎫 Detalles del Ticket'}
            </h2>

            {/* ===========================
                ESTADO
            =========================== */}
            <label className="block text-sm mb-1">Estado</label>
            {editando ? (
              <select
                value={ticketEditado.estado}
                onChange={(e) =>
                  setTicketEditado({
                    ...ticketEditado,
                    estado: e.target.value as TicketStatus,
                  })
                }
                className="w-full border rounded-lg px-3 py-2 mb-3"
              >
                <option value="Abierto">Abierto</option>
                <option value="En Progreso">En Progreso</option>
                <option value="Cerrado">Cerrado</option>
                <option value="Rechazado">Rechazado</option>
              </select>
            ) : (
              <p className="mb-3">{ticketEditado.estado}</p>
            )}

            {/* ===========================
                PRIORIDAD
            =========================== */}
            <label className="block text-sm mb-1">Prioridad</label>
            {editando ? (
              <select
                value={ticketEditado.prioridad}
                onChange={(e) =>
                  setTicketEditado({
                    ...ticketEditado,
                    prioridad: e.target.value as TicketPriority,
                  })
                }
                className="w-full border rounded-lg px-3 py-2 mb-3"
              >
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
                <option value="Urgente">Urgente</option>
              </select>
            ) : (
              <p className="mb-3">{ticketEditado.prioridad}</p>
            )}

            {/* ===========================
                ASUNTO
            =========================== */}
            <label className="block text-sm mb-1">Asunto</label>
            {editando ? (
              <input
                value={ticketEditado.asunto}
                onChange={(e) =>
                  setTicketEditado({
                    ...ticketEditado,
                    asunto: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2 mb-3"
              />
            ) : (
              <p className="mb-3">{ticketEditado.asunto}</p>
            )}

            {/* ===========================
                DESCRIPCIÓN
            =========================== */}
            <label className="block text-sm mb-1">Descripción</label>
            {editando ? (
              <textarea
                value={ticketEditado.descripcion}
                onChange={(e) =>
                  setTicketEditado({
                    ...ticketEditado,
                    descripcion: e.target.value,
                  })
                }
                rows={4}
                className="w-full border rounded-lg px-3 py-2 mb-4"
              />
            ) : (
              <p className="mb-4">{ticketEditado.descripcion}</p>
            )}

            {/* ===========================
                BOTONES (ROLES)
            =========================== */}
            <div className="flex gap-3 justify-end">
              {role !== 'cliente' && !editando && (
                <button
                  onClick={() => setEditando(true)}
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg"
                >
                  ✏️ Editar
                </button>
              )}

              {editando && (
                <button
                  onClick={handleGuardar}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                >
                  💾 Guardar
                </button>
              )}

              {role === 'admin' && ticketEditado.estado !== 'Cerrado' && (
                <button
                  onClick={handleCerrar}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg"
                >
                  ✓ Cerrar Ticket
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
