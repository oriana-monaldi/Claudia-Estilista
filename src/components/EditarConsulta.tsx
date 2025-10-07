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

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    marginBottom: "16px",
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: "#e1e5e9",
    borderRadius: "12px",
    fontSize: "16px",
    fontFamily: "inherit",
    backgroundColor: "#fff",
    transition: "all 0.2s ease",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const inputFocusStyle = {
    borderColor: "#BBA2A0",
    boxShadow: "0 0 0 3px rgba(187, 162, 160, 0.1)",
  };

  const containerStyle = {
    width: "100%",
    maxWidth: "400px",
    margin: "0 auto",
    padding: "24px",
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    boxSizing: "border-box" as const,
    zIndex: 2,
  };

  const buttonStyle = {
    width: "100%",
    padding: "16px",
    backgroundColor: "#BBA2A0",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginTop: "8px",
    boxShadow: "0 4px 12px rgba(187, 162, 160, 0.3)",
  };

  const buttonHoverStyle = {
    backgroundColor: "#A08E8D",
    transform: "translateY(-1px)",
    boxShadow: "0 6px 16px rgba(187, 162, 160, 0.4)",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#4a5568",
  };

  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        boxSizing: "border-box",
      }}
    >
      <div style={containerStyle}>
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
        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>👤 Nombre y apellido</label>
          <input
            name="nombreCompleto"
            placeholder="Nombre y apellido"
            value={form.nombreCompleto}
            onChange={handleChange}
            onFocus={() => setFocusedInput("nombreCompleto")}
            onBlur={() => setFocusedInput(null)}
            required
            style={{
              ...inputStyle,
              ...(focusedInput === "nombreCompleto" ? inputFocusStyle : {}),
            }}
          />
          <label style={labelStyle}>🎨 Color de tintura</label>
          <input
            name="colorTintura"
            placeholder="Color de tintura"
            value={form.colorTintura}
            onChange={handleChange}
            onFocus={() => setFocusedInput("colorTintura")}
            onBlur={() => setFocusedInput(null)}
            style={{
              ...inputStyle,
              ...(focusedInput === "colorTintura" ? inputFocusStyle : {}),
            }}
          />
          <label style={labelStyle}>📝 Nota adicional</label>
          <textarea
            name="notaAdicional"
            placeholder="Nota adicional"
            value={form.notaAdicional}
            onChange={handleChange}
            onFocus={() => setFocusedInput("notaAdicional")}
            onBlur={() => setFocusedInput(null)}
            style={{
              ...inputStyle,
              minHeight: "80px",
              resize: "vertical",
              ...(focusedInput === "notaAdicional" ? inputFocusStyle : {}),
            }}
          />
          <button
            type="submit"
            disabled={loading}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={{
              ...buttonStyle,
              ...(isHovering ? buttonHoverStyle : {}),
              background: loading ? "#ccc" : buttonStyle.backgroundColor,
              cursor: loading ? "not-allowed" : buttonStyle.cursor,
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
