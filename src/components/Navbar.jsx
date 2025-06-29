// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Importa Link para la navegación

const Navbar = ({ onSignOut }) => { // Recibe onSignOut como prop
  return (
    <nav className="bg-blue-700 p-4 text-white flex justify-between items-center">
      <div className="text-xl font-bold">Mi Sistema HR</div>
      <div>
        <Link to="/" className="mx-2 hover:underline">Inicio</Link>
        <Link to="/empleados" className="mx-2 hover:underline">Empleados</Link>
        <Link to="/perfil" className="mx-2 hover:underline">Perfil</Link>
        <button
          onClick={onSignOut} // Llama a la función de cerrar sesión
          className="ml-4 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;