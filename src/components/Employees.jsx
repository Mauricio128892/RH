// src/components/Employees.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Importa la instancia de Firestore
import { collection, addDoc, onSnapshot, query, orderBy, where } from 'firebase/firestore'; // Agrega 'where' para los filtros

const Employees = () => {
  // Estados para el formulario de agregar empleado
  const [employeeName, setEmployeeName] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employeeRole, setEmployeeRole] = useState('');

  // Estado para almacenar la lista de empleados
  const [employees, setEmployees] = useState([]);
  
  // Estado para indicar si los datos se están cargando
  const [loading, setLoading] = useState(true);

  // Estados para los términos de búsqueda
  const [searchTermName, setSearchTermName] = useState('');
  const [searchTermRole, setSearchTermRole] = useState('');
  const [searchTermEmail, setSearchTermEmail] = useState('');

  // Referencia a la colección 'employees' en Firestore
  // Esta referencia se usa para todas las operaciones (agregar, leer, escuchar)
  const employeesCollectionRef = collection(db, 'employees');

  // Función asincrónica para agregar un nuevo empleado a Firestore
  const addEmployee = async (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página

    // Validación básica de los campos del formulario
    if (!employeeName.trim() || !employeeEmail.trim() || !employeeRole.trim()) {
      // Usamos alert temporalmente; considera un modal personalizado en producción
      alert('Por favor, completa todos los campos.');
      return; // Detiene la ejecución si algún campo está vacío
    }

    try {
      // Usa addDoc para añadir un nuevo documento a la colección 'employees'
      await addDoc(employeesCollectionRef, {
        name: employeeName,
        email: employeeEmail,
        role: employeeRole,
        createdAt: new Date() // Añade una marca de tiempo para ordenar y seguimiento
      });
      alert('Empleado agregado exitosamente!'); // Mensaje de éxito
      
      // Limpia los campos del formulario después de una adición exitosa
      setEmployeeName('');
      setEmployeeEmail('');
      setEmployeeRole('');
    } catch (error) {
      // Captura y maneja cualquier error durante la adición
      console.error('Error al agregar empleado:', error.message);
      alert('Error al agregar empleado: ' + error.message);
    }
  };

  // useEffect para obtener y escuchar los cambios de empleados en tiempo real desde Firestore
  // Este efecto se re-ejecutará cada vez que cambien los términos de búsqueda,
  // recargando la lista de empleados de acuerdo a los filtros.
  useEffect(() => {
    setLoading(true); // Establece el estado de carga a true al inicio de la búsqueda

    let q = query(employeesCollectionRef); // Inicializa la consulta sin filtros

    // Aplicar filtros de búsqueda usando 'where' de Firestore
    // Firestore es eficiente para coincidencias exactas (==).
    // Para búsquedas parciales (ej. "contiene"), se realiza un filtro adicional en el cliente.
    
    // Si un término de búsqueda no está vacío, añade una cláusula 'where' a la consulta.
    // Nota importante: Firestore tiene limitaciones. No puedes usar múltiples cláusulas 'where'
    // con operadores de desigualdad (como '>', '<', '!='), o en campos diferentes sin índices compuestos.
    // Para búsquedas que "contienen" texto, la filtración en el cliente es más flexible.
    if (searchTermName.trim() !== '') {
      // Para un filtro exacto desde Firestore:
      // q = query(q, where('name', '==', searchTermName));
      // Para búsqueda parcial, dependemos del filtro en cliente.
    }

    if (searchTermRole.trim() !== '') {
      // Para un filtro exacto desde Firestore:
      // q = query(q, where('role', '==', searchTermRole));
      // Para búsqueda parcial, dependemos del filtro en cliente.
    }

    if (searchTermEmail.trim() !== '') {
      // Para un filtro exacto desde Firestore:
      // q = query(q, where('email', '==', searchTermEmail));
      // Para búsqueda parcial, dependemos del filtro en cliente.
    }

    // El ordenamiento se aplica a la consulta de Firestore.
    // Si no se aplican filtros 'where' de igualdad, podemos ordenar por 'createdAt'.
    // Si se aplican múltiples filtros 'where' de igualdad en campos diferentes,
    // se requeriría un índice compuesto en Firestore para poder ordenar en un campo diferente.
    // Por simplicidad para esta demo, si no hay filtros, ordenamos por 'createdAt'.
    // Si hay filtros, la ordenación por 'createdAt' podría necesitar un índice compuesto en Firestore
    // si no es el primer campo en una cláusula 'where' de igualdad.
    if (searchTermName.trim() === '' && searchTermRole.trim() === '' && searchTermEmail.trim() === '') {
        q = query(q, orderBy('createdAt', 'desc'));
    }
    // Si hay filtros, asumimos que la ordenación principal ya no es por createdAt
    // y la ordenación real se hará implícitamente o si se desea, se puede añadir
    // una lógica de ordenación en el cliente después de la filtración.


    // onSnapshot establece un listener en tiempo real.
    // Cualquier cambio en la colección 'employees' en Firestore activará esta función.
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let employeesData = snapshot.docs.map((doc) => ({
        ...doc.data(), // Obtiene todos los campos del documento
        id: doc.id,     // Añade el ID único del documento de Firestore
      }));

      // FILTRADO ADICIONAL EN CLIENTE PARA COINCIDENCIAS PARCIALES O NO EXACTAS
      // Esto es necesario porque Firestore no tiene un operador de "contiene" nativo para texto.
      // Filtramos la data obtenida de Firestore en memoria.
      if (searchTermName.trim() !== '') {
        const lowerCaseSearchName = searchTermName.toLowerCase();
        employeesData = employeesData.filter(employee =>
          employee.name.toLowerCase().includes(lowerCaseSearchName)
        );
      }
      if (searchTermRole.trim() !== '') {
        const lowerCaseSearchRole = searchTermRole.toLowerCase();
        employeesData = employeesData.filter(employee =>
          employee.role.toLowerCase().includes(lowerCaseSearchRole)
        );
      }
      if (searchTermEmail.trim() !== '') {
        const lowerCaseSearchEmail = searchTermEmail.toLowerCase();
        employeesData = employeesData.filter(employee =>
          employee.email.toLowerCase().includes(lowerCaseSearchEmail)
        );
      }

      setEmployees(employeesData); // Actualiza el estado con los empleados filtrados
      setLoading(false); // Desactiva el estado de carga
    }, (error) => {
      // Manejo de errores para el listener
      console.error("Error al obtener empleados:", error);
      setLoading(false); // Desactiva la carga incluso en caso de error
    });

    // La función retornada por useEffect se ejecuta cuando el componente se desmonta
    // Esto es crucial para desuscribirse del listener de Firestore y evitar fugas de memoria.
    return () => unsubscribe();
  }, [searchTermName, searchTermRole, searchTermEmail]); // Dependencias: el efecto se re-ejecuta cuando cambian estos estados

  // Muestra un mensaje de carga mientras se obtienen los datos
  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[calc(100vh-64px)]">
        <p className="text-xl text-gray-600">Cargando empleados...</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Gestión de Empleados</h2>

      {/* Formulario para agregar nuevo empleado */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Agregar Nuevo Empleado</h3>
        <form onSubmit={addEmployee} className="space-y-4">
          <div>
            <label htmlFor="add-name" className="block text-sm font-medium text-gray-700">Nombre:</label>
            <input
              type="text"
              id="add-name" // ID único para este input
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              required // Hace que el campo sea obligatorio
            />
          </div>
          <div>
            <label htmlFor="add-email" className="block text-sm font-medium text-gray-700">Correo Electrónico:</label>
            <input
              type="email"
              id="add-email" // ID único para este input
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={employeeEmail}
              onChange={(e) => setEmployeeEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="add-role" className="block text-sm font-medium text-gray-700">Rol:</label>
            <input
              type="text"
              id="add-role" // ID único para este input
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={employeeRole}
              onChange={(e) => setEmployeeRole(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
          >
            Agregar Empleado
          </button>
        </form>
      </div>

      {/* Sección de Búsqueda de Empleados */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Buscar Empleados</h3>
        {/* Usamos un grid para organizar los campos de búsqueda en 3 columnas en pantallas medianas y grandes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search-name" className="block text-sm font-medium text-gray-700">Buscar por Nombre:</label>
            <input
              type="text"
              id="search-name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={searchTermName}
              onChange={(e) => setSearchTermName(e.target.value)}
              placeholder="Ej. Juan Pérez"
            />
          </div>
          <div>
            <label htmlFor="search-role" className="block text-sm font-medium text-gray-700">Buscar por Rol:</label>
            <input
              type="text"
              id="search-role"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={searchTermRole}
              onChange={(e) => setSearchTermRole(e.target.value)}
              placeholder="Ej. Desarrollador"
            />
          </div>
          <div>
            <label htmlFor="search-email" className="block text-sm font-medium text-gray-700">Buscar por Correo:</label>
            <input
              type="email"
              id="search-email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={searchTermEmail}
              onChange={(e) => setSearchTermEmail(e.target.value)}
              placeholder="Ej. juan@empresa.com"
            />
          </div>
        </div>
        {/* Se eliminó el botón de "Aplicar Filtros" comentado que estaba causando problemas de sintaxis */}
      </div>


      {/* Lista/Tabla de Empleados Actuales */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Empleados Actuales</h3>
        {employees.length === 0 ? (
          // Mensaje si no hay empleados o no se encontraron con los filtros
          <p className="text-gray-600">No se encontraron empleados con los filtros actuales o no hay empleados registrados.</p>
        ) : (
          <div className="overflow-x-auto"> {/* Permite el desplazamiento horizontal si la tabla es muy ancha */}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Correo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  {/* Puedes añadir más encabezados para otras acciones como Editar/Eliminar */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id}> {/* Usa el ID de Firestore como clave única */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.role}</div>
                    </td>
                    {/* Aquí puedes añadir celdas para botones de Editar/Eliminar */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employees;
