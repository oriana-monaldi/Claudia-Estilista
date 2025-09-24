import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";
import { ConsultaCliente } from "../../types.consulta";

const COLLECTION_NAME = "consultas";

export const addConsulta = async (
  consulta: Omit<ConsultaCliente, "id">
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), consulta);
    console.log("Consulta agregada con ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error agregando consulta: ", error);
    throw error;
  }
};

export const getConsultas = async (): Promise<ConsultaCliente[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("nombreCompleto"));
    const querySnapshot = await getDocs(q);
    const consultas: ConsultaCliente[] = [];

    querySnapshot.forEach((doc) => {
      consultas.push({
        id: doc.id,
        ...doc.data(),
      } as ConsultaCliente);
    });

    return consultas;
  } catch (error) {
    console.error("Error obteniendo consultas: ", error);
    throw error;
  }
};

export const updateConsulta = async (
  id: string,
  consulta: Partial<Omit<ConsultaCliente, "id">>
): Promise<void> => {
  try {
    const consultaRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(consultaRef, consulta);
    console.log("Consulta actualizada con ID: ", id);
  } catch (error) {
    console.error("Error actualizando consulta: ", error);
    throw error;
  }
};

export const deleteConsulta = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    console.log("Consulta eliminada con ID: ", id);
  } catch (error) {
    console.error("Error eliminando consulta: ", error);
    throw error;
  }
};

// Buscar consultas por nombre
export const searchConsultasByNombre = async (
  nombre: string
): Promise<ConsultaCliente[]> => {
  try {
    const consultas = await getConsultas();
    return consultas.filter((consulta) =>
      consulta.nombreCompleto.toLowerCase().includes(nombre.toLowerCase())
    );
  } catch (error) {
    console.error("Error buscando consultas: ", error);
    throw error;
  }
};
