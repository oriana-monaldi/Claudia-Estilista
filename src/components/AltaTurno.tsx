"use client";

import type React from "react";
import { useState } from "react";
import type { Turno } from "../types";
import { addTurno } from "../assets/utils/localStorageTurnos";

interface Props {
  onTurnoRegistrado: () => void;
}

export function AltaTurno({ onTurnoRegistrado }: Props) {
  const [form, setForm] = useState<Omit<Turno, "id">>({
    nombre: "",
    telefono: "",
    servicio: "",
    fecha: "",
    hora: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.nombre ||
      !form.telefono ||
      !form.servicio ||
      !form.fecha ||
      !form.hora
    )
      return;
    await addTurno(form);
    setForm({ nombre: "", telefono: "", servicio: "", fecha: "", hora: "" });
    onTurnoRegistrado();
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
    borderColor: "#ff6b9d",
    boxShadow: "0 0 0 3px rgba(255, 107, 157, 0.1)",
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
  };

  const buttonStyle = {
    width: "100%",
    padding: "16px",
    backgroundColor: "#ff6b9d",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginTop: "8px",
    boxShadow: "0 4px 12px rgba(255, 107, 157, 0.3)",
  };

  const buttonHoverStyle = {
    backgroundColor: "#e55a87",
    transform: "translateY(-1px)",
    boxShadow: "0 6px 16px rgba(255, 107, 157, 0.4)",
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
          Registrar Turno
        </button>
      </form>
    </div>
  );
}
