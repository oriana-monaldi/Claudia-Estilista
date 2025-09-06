import { ConsultaCliente } from "../../types.consulta";

const STORAGE_KEY = "consultas-clientes";

function getConsultas(): ConsultaCliente[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveConsultas(consultas: ConsultaCliente[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consultas));
}

function addConsulta(consulta: Omit<ConsultaCliente, "id">) {
  const consultas = getConsultas();
  const id = Date.now().toString();
  consultas.push({ ...consulta, id });
  saveConsultas(consultas);
}

function updateConsulta(id: string, consulta: Omit<ConsultaCliente, "id">) {
  const consultas = getConsultas();
  const idx = consultas.findIndex((c) => c.id === id);
  if (idx !== -1) {
    consultas[idx] = { ...consulta, id };
    saveConsultas(consultas);
  }
}

function deleteConsulta(id: string) {
  const consultas = getConsultas().filter((c) => c.id !== id);
  saveConsultas(consultas);
}

export { getConsultas, addConsulta, updateConsulta, deleteConsulta };
