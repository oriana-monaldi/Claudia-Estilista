import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { addConsulta } from "../assets/utils/firestoreConsultas";
import { ConsultaCliente } from "../types.consulta";

const initialForm: Omit<ConsultaCliente, "id"> = {
  nombreCompleto: "",
  colorTintura: "",
  notaAdicional: "",
};

export default function AltaConsulta() {
  const [form, setForm] = useState(initialForm);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addConsulta(form);
      Swal.fire({
        title: "Consulta registrada!",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
      navigate("/consultas");
    } catch (error) {
      console.error("Error al registrar consulta:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo registrar la consulta. Intenta nuevamente.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
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
        padding: "16px 0",
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
          aria-label="Volver a Consultas"
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
          NUEVA CONSULTA
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
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={{
              ...buttonStyle,
              ...(isHovering ? buttonHoverStyle : {}),
            }}
          >
            Registrar Consulta
          </button>
        </form>
      </div>
    </div>
  );
}
