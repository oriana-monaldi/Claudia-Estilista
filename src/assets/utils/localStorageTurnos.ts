import { Turno } from "../../types";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBtcmAYEoxShrHQ9trXlf9Xr4-0tPR7cV0",
  authDomain: "claudia-estilista.firebaseapp.com",
  projectId: "claudia-estilista",
  storageBucket: "claudia-estilista.firebasestorage.app",
  messagingSenderId: "1064487418488",
  appId: "1:1064487418488:web:0ecb9793415dba46ce0b8d",
  measurementId: "G-TL550EF243"
};

// Inicializa Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TURNOS_COLLECTION = "turnos";

// Obtener todos los turnos
export async function getTurnos(): Promise<Turno[]> {
  const snapshot = await getDocs(collection(db, TURNOS_COLLECTION));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Turno));
}

// Agregar un turno
export async function addTurno(turno: Omit<Turno, "id">): Promise<void> {
  await addDoc(collection(db, TURNOS_COLLECTION), turno);
}

// Actualizar un turno
export async function updateTurno(turno: Turno): Promise<void> {
  const ref = doc(db, TURNOS_COLLECTION, turno.id);
  await updateDoc(ref, {
    nombre: turno.nombre,
    telefono: turno.telefono,
    servicio: turno.servicio,
    fecha: turno.fecha,
    hora: turno.hora
  });
}

// Eliminar un turno
export async function deleteTurno(id: string): Promise<void> {
  const ref = doc(db, TURNOS_COLLECTION, id);
  await deleteDoc(ref);
}