// src/context/AuthContext.jsx (o src/AuthContext.jsx)
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebase'; // Cambia '../' por './'
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Para saber si Firebase ya verificó la sesión

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Limpia el listener cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children} {/* Renderiza los hijos solo cuando la carga inicial ha terminado */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};