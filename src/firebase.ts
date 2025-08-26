// firebase.ts - Configuración completa y corregida
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // ← IMPORTANTE: Agregar esta línea

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtcmAYEoxShrHQ9trXlf9Xr4-0tPR7cV0",
  authDomain: "claudia-estilista.firebaseapp.com",
  projectId: "claudia-estilista",
  storageBucket: "claudia-estilista.firebasestorage.app",
  messagingSenderId: "1064487418488",
  appId: "1:1064487418488:web:0ecb9793415dba46ce0b8d",
  measurementId: "G-TL550EF243"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ← IMPORTANTE: Agregar estas líneas
export const db = getFirestore(app); // Exportar Firestore
export default app;