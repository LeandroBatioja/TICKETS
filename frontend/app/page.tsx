'use client';

import { useEffect, useState } from 'react';
import { Ticket } from '@/types/ticket';
import { getTickets } from '@/lib/api';
import TicketCard from '@/components/TicketCard';
import DashboardStats from '@/components/DashboardStats';
import NewTicketModal from '@/components/NewTicketModal';
import { useAuth } from '@/context/AuthContext';

export default function Page() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const { role, loading } = useAuth();

  /* =========================
     CARGAR TICKETS REALES
  ========================== */
  const refrescarTickets = async () => {
    const data = await getTickets();
    setTickets(data);
  };

  useEffect(() => {
    refrescarTickets();
  }, []);

  /* =========================
     ACTUALIZAR TICKET LOCAL
  ========================== */
  const actualizarTicket = (ticketActualizado: Ticket) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketActualizado.id ? ticketActualizado : t
      )
    );
  };

  if (loading) return null;

  return (
    <main className="p-8 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">
          🎫 Gestión de Tickets
        </h1>
          <button
            onClick={() => setMostrarModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            ➕ Nuevo Ticket
          </button>
      </div>

      {/* STATS */}
      <DashboardStats tickets={tickets} />

      {/* LISTA */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onUpdate={actualizarTicket}
          />
        ))}
      </section>

      {/* MODAL NUEVO TICKET */}
      {mostrarModal && (
        <NewTicketModal
          onClose={() => setMostrarModal(false)}
          onCreated={refrescarTickets} // 🔥 CONEXIÓN REAL
        />
      )}
    </main>
  );
}
