'use client';

import { useState } from 'react';
import { crearTicket } from '@/lib/api';

interface Props {
  onClose: () => void;
  onCreated: () => void; // 🔹 refresca lista
}

export default function NewTicketModal({ onClose, onCreated }: Props) {
  const [asunto, setAsunto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [prioridad, setPrioridad] = useState<'baja' | 'media' | 'alta'>('media');
  const [loading, setLoading] = useState(false);

  /* =========================
     CREAR TICKET REAL
  ========================== */
  const handleCrear = async () => {
    if (!asunto.trim()) {
      alert('El asunto es obligatorio');
      return;
    }

    try {
      setLoading(true);

      await crearTicket({
        id_usuario: 1, // ⚠️ ajusta si usas auth
        asunto,
        prioridad,
      });

      onCreated(); // 🔹 vuelve a pedir tickets reales
      onClose();
    } catch (error) {
      alert('Error al crear ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">

        {/* HEADER */}
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          ➕ Nuevo Ticket
        </h2>

        {/* FORM */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">
              Asunto
            </label>
            <input
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-300"
              placeholder="Ej: Error al iniciar sesión"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-300"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">
              Prioridad
            </label>
            <select
              value={prioridad}
              onChange={(e) => setPrioridad(e.target.value as any)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-300"
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            Cancelar
          </button>

          <button
            onClick={handleCrear}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50"
          >
            {loading ? 'Creando...' : 'Crear Ticket'}
          </button>
        </div>

      </div>
    </div>
  );
}
