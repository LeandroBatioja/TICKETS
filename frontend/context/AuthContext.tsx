'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '@/types/users';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔐 SIMULADO (luego se conecta al backend real)
    const usuarioSimulado: User = {
      id: 1,
      nombre: 'Administrador',
      rol: 'admin', // admin | operador | cliente
    };

    setUser(usuarioSimulado);
    setRole(usuarioSimulado.rol);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
