// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Importamos getAuth y GoogleAuthProvider
import { getFirestore } from "firebase/firestore"; // Importamos getFirestore

// Tu configuración de Firebase (esta ya la tienes correctamente)
const firebaseConfig = {
  apiKey: "AIzaSyBP19uhA7jCVOy1P1qAgh7Hb68XYK33Glg",
  authDomain: "recusosh-fede5.firebaseapp.com",
  projectId: "recusosh-fede5",
  storageBucket: "recusosh-fede5.firebasestorage.app",
  messagingSenderId: "54809295735",
  appId: "1:54809295735:web:3bd8528f9a15a35e6fff72",
  measurementId: "G-P9T0SRHGME" // Este puedes dejarlo o quitarlo, no afecta la funcionalidad principal
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa y exporta los servicios que vamos a usar
export const auth = getAuth(app); // Instancia de Authentication
export const provider = new GoogleAuthProvider(); // Proveedor para el inicio de sesión con Google
export const db = getFirestore(app); // Instancia de Firestore

// getAnalytics(app); // Puedes comentar o eliminar esta línea si no necesitas Google Analytics