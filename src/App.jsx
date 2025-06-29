// src/App.jsx
import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Importa el hook useAuth para acceder al estado de autenticación
import { auth } from './firebase'; // Asegúrate que la ruta a tu firebase.js sea correcta
import { signOut } from 'firebase/auth'; // Importa signOut para cerrar sesión

// Importa todos los componentes necesarios para la aplicación
import Navbar from './components/Navbar'; // Componente de la barra de navegación
import Login from './components/Login'; // Componente de inicio de sesión con Google
import Employees from './components/Employees'; // Componente de gestión de empleados
import Perfil from './components/perfil'; // Componente de perfil de usuario (nombre ajustado a pefil.jsx)

// --- Componente para la Página de Inicio ---
// Muestra el mensaje de bienvenida.
const HomePage = () => (
  <div className="p-4">
    <h1 className="text-3xl font-bold mb-4">Bienvenido a mi página de RH</h1>
    <p className="text-gray-700">Explora las secciones de tu sistema de Recursos Humanos.</p>
  </div>
);

// --- Componente de Ruta Privada ---
// Este componente actúa como un "guardián" para las rutas.
// Solo permite el acceso si el usuario está autenticado.
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Obtiene el estado del usuario y si está cargando del AuthContext
  const navigate = useNavigate(); // Hook para la navegación programática

  if (loading) {
    // Muestra un mensaje de carga o un spinner mientras se verifica el estado de autenticación
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-semibold text-gray-700">
        Cargando...
      </div>
    );
  }

  if (!user) {
    // Si no hay usuario (no autenticado) y la carga ya ha terminado, redirige al login
    // Usamos useEffect para asegurar que la redirección ocurra después del render inicial
    React.useEffect(() => {
      navigate('/login');
    }, [navigate]);
    return null; // No renderiza nada hasta que se redirija
  }

  // Si hay un usuario autenticado y la carga ha terminado, renderiza los componentes hijos
  return children;
};

// --- Componente Principal de la Aplicación ---
// Aquí se definen todas las rutas y la lógica global de la aplicación.
function App() {
  const { user } = useAuth(); // Obtiene el estado del usuario autenticado del AuthContext
  const navigate = useNavigate(); // Hook para la navegación programática

  // Función para manejar el cierre de sesión
  const handleSignOut = async () => {
    try {
      await signOut(auth); // Llama a la función de Firebase para cerrar la sesión actual
      navigate('/login'); // Redirige al usuario a la página de inicio de sesión después de cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
      // Muestra un mensaje de error al usuario si el cierre de sesión falla
      alert("Error al cerrar sesión: " + error.message); 
    }
  };

  return (
    <>
      {/* El Navbar solo se renderiza si hay un usuario logueado.
          Se le pasa la función handleSignOut como una prop. */}
      {user && <Navbar onSignOut={handleSignOut} />}

      {/* Definición de todas las rutas de la aplicación usando React Router DOM */}
      <Routes>
        {/* Ruta para la página de inicio de sesión (no está protegida) */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas: solo accesibles si el usuario está autenticado.
            Se envuelven con el componente PrivateRoute. */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage /> {/* Página de inicio */}
            </PrivateRoute>
          }
        />
        <Route
          path="/empleados"
          element={
            <PrivateRoute>
              <Employees /> {/* Página de gestión de empleados */}
            </PrivateRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <Perfil /> {/* Página de perfil del usuario */}
            </PrivateRoute>
          }
        />

        {/* Ruta comodín para cualquier otra URL no definida (página 404 - No encontrada) */}
        <Route path="*" element={<h1 className="text-4xl text-center mt-20">404 - Página no encontrada</h1>} />
      </Routes>
    </>
  );
}

export default App;
