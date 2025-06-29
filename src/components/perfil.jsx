// src/components/pefil.jsx
import React from 'react';
import { useAuth } from '../AuthContext'; // Importa el hook useAuth para acceder al usuario

const Pefil = () => { // Cambiado el nombre del componente a Pefil
  // Obtiene el objeto de usuario del contexto de autenticación
  const { user } = useAuth();

  // Si el usuario no está disponible (por ejemplo, aún cargando o no autenticado),
  // se mostrará un mensaje de carga o será redirigido por PrivateRoute.
  if (!user) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[calc(100vh-64px)]">
        <p className="text-xl text-gray-600">Cargando información del perfil...</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto mt-8 bg-white shadow-md rounded-lg rounded-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Mi Perfil</h2>
      
      <div className="flex flex-col items-center space-y-4">
        {/* Muestra la foto de perfil del usuario de Google si está disponible */}
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt="Foto de perfil"
            className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg object-cover"
          />
        ) : (
          // Un fallback si no hay foto de perfil (puedes usar una inicial o un ícono)
          <div className="w-32 h-32 rounded-full border-4 border-blue-500 bg-gray-200 flex items-center justify-center text-5xl font-bold text-gray-600">
            {user.displayName ? user.displayName[0].toUpperCase() : '?'}
          </div>
        )}

        {/* Muestra el nombre del usuario */}
        <h3 className="text-2xl font-semibold text-gray-900">
          {user.displayName || 'Nombre no disponible'} {/* Muestra el nombre o un placeholder */}
        </h3>

        {/* Muestra el correo electrónico del usuario */}
        <p className="text-lg text-gray-700">
          Correo: <span className="font-medium">{user.email || 'Correo no disponible'}</span>
        </p>

        {/* Puedes añadir más información del perfil aquí si Firebase la proporciona o si la guardas en Firestore */}
        {/* <p className="text-gray-600">UID: {user.uid}</p> */}
      </div>
    </div>
  );
};

export default Pefil; // Asegúrate de que el componente exportado coincida con el nombre del archivo
