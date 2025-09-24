import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getConsultas,
  updateConsulta,
} from "../assets/utils/firestoreConsultas";
import { ConsultaCliente } from "../types.consulta";

const initialForm: Omit<ConsultaCliente, "id"> = {
  nombreCompleto: "",
  colorTintura: "",
  notaAdicional: "",
};

export default function EditarConsulta() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadConsulta = async () => {
      if (id) {
        try {
          const consultas = await getConsultas();
          const consulta = consultas.find((c) => c.id === id);
          if (consulta) {
            setForm({
              nombreCompleto: consulta.nombreCompleto,
              colorTintura: consulta.colorTintura,
              notaAdicional: consulta.notaAdicional,
            });
          }
        } catch (error) {
          console.error("Error cargando consulta:", error);
        }
      }
    };
    loadConsulta();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (id) {
      try {
        await updateConsulta(id, form);
        navigate("/consultas");
      } catch (error) {
        console.error("Error actualizando consulta:", error);
        alert("Error al actualizar la consulta. Intenta nuevamente.");
      }
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 0",
      }}
    >
      <div
        style={{
          maxWidth: 480,
          margin: "0 auto",
          padding: 16,
          position: "relative",
        }}
      >
        <button
          onClick={() => navigate("/consultas")}
          style={{
            position: "relative",
            top: 0,
            left: 0,
            background: "#fff",
            border: "none",
            color: "#000",
            fontSize: 28,
            cursor: "pointer",
            zIndex: 100,
            padding: 4,
            borderRadius: 24,
            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
            display: "flex",
            alignItems: "center",
            marginBottom: 8,
          }}
          aria-label="Volver al Home"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 6L9 12L15 18"
              stroke="#000"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h2
          style={{
            color: "#111",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          EDITAR CONSULTA
        </h2>
        <form onSubmit={handleSubmit} style={{ marginTop: 32 }}>
          <label>👤 Nombre y apellido</label>
          <input
            className="input-principal"
            name="nombreCompleto"
            placeholder="Nombre y apellido"
            value={form.nombreCompleto}
            onChange={handleChange}
            required
            style={{ marginBottom: 12, width: "100%" }}
          />
          <label>🎨 Color de tintura</label>
          <input
            className="input-principal"
            name="colorTintura"
            placeholder="Color de tintura"
            value={form.colorTintura}
            onChange={handleChange}
            style={{ marginBottom: 12, width: "100%" }}
          />
          <label>📝 Nota adicional</label>
          <textarea
            className="input-principal"
            name="notaAdicional"
            placeholder="Nota adicional"
            value={form.notaAdicional}
            onChange={handleChange}
            style={{ marginBottom: 24, width: "100%" }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "#ccc" : "#BBA2A0",
              color: "#fff",
              fontWeight: 700,
              padding: "12px 0",
              border: "none",
              borderRadius: 8,
              fontSize: 18,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/consultas")}
            style={{
              width: "100%",
              background: "#bbb",
              color: "#fff",
              fontWeight: 700,
              padding: "12px 0",
              border: "none",
              borderRadius: 8,
              fontSize: 18,
              cursor: "pointer",
              marginTop: 8,
            }}
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
