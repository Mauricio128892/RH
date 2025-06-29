// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Tu archivo de estilos principal
import { BrowserRouter } from 'react-router-dom'; // Importa BrowserRouter
import { AuthProvider } from './AuthContext'; // Quita 'context/'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);