import { Turno } from "../../types";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const TURNOS_COLLECTION = "turnos";

// Obtener todos los turnos
export async function getTurnos(): Promise<Turno[]> {
  const snapshot = await getDocs(collection(db, TURNOS_COLLECTION));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Turno));
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
    hora: turno.hora,
  });
}

// Eliminar un turno
export async function deleteTurno(id: string): Promise<void> {
  const ref = doc(db, TURNOS_COLLECTION, id);
  await deleteDoc(ref);
}
