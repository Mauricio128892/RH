
import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, addDoc, onSnapshot, query, orderBy, where } from 'firebase/firestore'; 

const Employees = () => {

  const [employeeName, setEmployeeName] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employeeRole, setEmployeeRole] = useState('');

  
  const [employees, setEmployees] = useState([]);
  

  const [loading, setLoading] = useState(true);


  const [searchTermName, setSearchTermName] = useState('');
  const [searchTermRole, setSearchTermRole] = useState('');
  const [searchTermEmail, setSearchTermEmail] = useState('');


  const employeesCollectionRef = collection(db, 'employees');

  const addEmployee = async (e) => {
    e.preventDefault(); 

    if (!employeeName.trim() || !employeeEmail.trim() || !employeeRole.trim()) {
      
      alert('Por favor, completa todos los campos.');
      return; 
    }

    try {
   
      await addDoc(employeesCollectionRef, {
        name: employeeName,
        email: employeeEmail,
        role: employeeRole,
        createdAt: new Date() 
      });
      alert('Empleado agregado exitosamente!'); 
      
    
      setEmployeeName('');
      setEmployeeEmail('');
      setEmployeeRole('');
    } catch (error) {
   
      console.error('Error al agregar empleado:', error.message);
      alert('Error al agregar empleado: ' + error.message);
    }
  };


  useEffect(() => {
    setLoading(true); 

    let q = query(employeesCollectionRef); 


   if (searchTermName.trim() !== '') {
    
    }

    if (searchTermRole.trim() !== '') {

    }

    if (searchTermEmail.trim() !== '') {

    }


    if (searchTermName.trim() === '' && searchTermRole.trim() === '' && searchTermEmail.trim() === '') {
        q = query(q, orderBy('createdAt', 'desc'));
    }




    const unsubscribe = onSnapshot(q, (snapshot) => {
      let employeesData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,    
      }));


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

      setEmployees(employeesData); 
      setLoading(false); 
    }, (error) => {
      
      console.error("Error al obtener empleados:", error);
      setLoading(false); 
    });

   
    return () => unsubscribe();
  }, [searchTermName, searchTermRole, searchTermEmail]); 
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

 
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Agregar Nuevo Empleado</h3>
        <form onSubmit={addEmployee} className="space-y-4">
          <div>
            <label htmlFor="add-name" className="block text-sm font-medium text-gray-700">Nombre:</label>
            <input
              type="text"
              id="add-name" 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              required 
            />
          </div>
          <div>
            <label htmlFor="add-email" className="block text-sm font-medium text-gray-700">Correo Electrónico:</label>
            <input
              type="email"
              id="add-email" 
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
              id="add-role" 
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

    
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Buscar Empleados</h3>
      
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
      </div>


      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Empleados Actuales</h3>
        {employees.length === 0 ? (
          <p className="text-gray-600">No se encontraron empleados con los filtros actuales o no hay empleados registrados.</p>
        ) : (
          <div className="overflow-x-auto"> 
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
                 
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id}> 
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.role}</div>
                    </td>
                    
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
