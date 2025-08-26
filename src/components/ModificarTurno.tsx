"use client";

import type React from "react";

import { useState } from "react";
import type { Turno } from "../types";
import { updateTurno } from "../assets/utils/localStorageTurnos";

interface Props {
  turno: Turno;
  onTurnoActualizado: () => void;
}

export function ModificarTurno({ turno, onTurnoActualizado }: Props) {
  const [form, setForm] = useState<Omit<Turno, "id">>({
    nombre: turno.nombre,
    telefono: turno.telefono,
    servicio: turno.servicio,
    fecha: turno.fecha,
    hora: turno.hora,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTurno({ ...form, id: turno.id });
    onTurnoActualizado();
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
    borderColor: "#ffc107",
    boxShadow: "0 0 0 3px rgba(255, 193, 7, 0.1)",
  };

  const containerStyle = {
    maxWidth: "400px",
    margin: "0 auto",
    padding: "24px",
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    // border: "none",
  };

  const buttonStyle = {
    width: "100%",
    padding: "16px",
    backgroundColor: "#ffc107",
    color: "#212529",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginTop: "8px",
    boxShadow: "0 4px 12px rgba(255, 193, 7, 0.3)",
  };

  const buttonHoverStyle = {
    backgroundColor: "#ffca28",
    transform: "translateY(-1px)",
    boxShadow: "0 6px 16px rgba(255, 193, 7, 0.4)",
  };

  const fechaInputStyle = {
    ...inputStyle,
    marginBottom: 0,
  };

  const horaInputStyle = {
    ...inputStyle,
    marginBottom: 0,
    maxWidth: "200px",
  };

  const fechaHoraContainerStyle = {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
    marginBottom: "16px",
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
    <div style={containerStyle}>
      <div
        style={{
          textAlign: "center" as const,
          marginBottom: "24px",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#4a5568",
            margin: "0 0 8px 0",
          }}
        >
          Editando turno de
        </h3>
        <p
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#2d3748",
            margin: "0",
            background: "linear-gradient(135deg, #ffc107, #ff8f00)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {turno.nombre}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          name="nombre"
          placeholder="👤 Nombre completo"
          value={form.nombre}
          onChange={handleChange}
          onFocus={() => setFocusedInput("nombre")}
          onBlur={() => setFocusedInput(null)}
          required
          style={{
            ...inputStyle,
            ...(focusedInput === "nombre" ? inputFocusStyle : {}),
          }}
        />

        <input
          name="telefono"
          placeholder="📱 Teléfono"
          value={form.telefono}
          onChange={handleChange}
          onFocus={() => setFocusedInput("telefono")}
          onBlur={() => setFocusedInput(null)}
          required
          style={{
            ...inputStyle,
            ...(focusedInput === "telefono" ? inputFocusStyle : {}),
          }}
        />

        <input
          name="servicio"
          placeholder="Servicio"
          value={form.servicio}
          onChange={handleChange}
          onFocus={() => setFocusedInput("servicio")}
          onBlur={() => setFocusedInput(null)}
          required
          style={{
            ...inputStyle,
            ...(focusedInput === "servicio" ? inputFocusStyle : {}),
          }}
        />

        <div style={fechaHoraContainerStyle}>
          <div>
            <label style={labelStyle}>📅 Fecha</label>
            <input
              name="fecha"
              type="date"
              value={form.fecha}
              onChange={handleChange}
              onFocus={() => setFocusedInput("fecha")}
              onBlur={() => setFocusedInput(null)}
              required
              style={{
                ...fechaInputStyle,
                ...(focusedInput === "fecha" ? inputFocusStyle : {}),
              }}
            />
          </div>

          <div>
            <label style={labelStyle}>🕐 Hora</label>
            <input
              name="hora"
              type="time"
              value={form.hora}
              onChange={handleChange}
              onFocus={() => setFocusedInput("hora")}
              onBlur={() => setFocusedInput(null)}
              required
              style={{
                ...horaInputStyle,
                ...(focusedInput === "hora" ? inputFocusStyle : {}),
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          style={{
            ...buttonStyle,
            ...(isHovering ? buttonHoverStyle : {}),
          }}
        >
          💾 Guardar Cambios
        </button>
      </form>
    </div>
  );
}
