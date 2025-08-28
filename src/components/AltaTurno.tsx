"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Turno } from "../types";
import { addTurno } from "../assets/utils/localStorageTurnos";
import Swal from "sweetalert2";

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
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.target.name === "telefono") {
      const value = e.target.value.replace(/[^0-9]/g, "");
      setForm({ ...form, telefono: value });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaTurno = new Date(form.fecha + "T00:00:00");
    if (
      !form.nombre ||
      !form.telefono ||
      !form.servicio ||
      !form.fecha ||
      !form.hora
    )
      return;
    if (fechaTurno < hoy) {
      await Swal.fire({
        icon: "error",
        title: "Fecha inválida",
        text: "No se puede crear un turno en una fecha menor a hoy.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#ef4444",
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: true,
      });
      return;
    }
    await addTurno(form);
    setForm({ nombre: "", telefono: "", servicio: "", fecha: "", hora: "" });
    await Swal.fire({
      icon: "success",
      title: "Turno registrado",
      text: "El turno se ha dado de alta correctamente.",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
    onTurnoRegistrado();
    navigate("/");
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
      <div style={containerStyle}>
        <h2
          style={{
            color: "#111",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          NUEVO TURNO
        </h2>
        <form onSubmit={handleSubmit}>
          <label style={labelStyle}> 👤 Nombre Completo</label>
          <input
            name="nombre"
            placeholder=" Nombre completo"
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

          <label style={labelStyle}>📱 Teléfono</label>

          <input
            name="telefono"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder=" Teléfono"
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
          <label style={labelStyle}>✂️ Servicio a realizarse</label>
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
    </div>
  );
}
