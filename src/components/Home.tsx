"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const containerStyle = {
    minHeight: "100vh",
    background: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 8px 0 8px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    overflowX: "hidden" as "hidden",
  };

  const cardStyle = {
    backgroundColor: "transparent",
    borderRadius: 0,
    padding: 0,
    boxShadow: "none",
    textAlign: "center" as const,
    maxWidth: "380px",
    width: "100%",
    margin: "0 auto",
    transform: "none",
    transition: "all 0.3s ease",
  };

  const titleStyle = {
    fontSize: "32px",
    fontWeight: "800",
    margin: "0 0 16px 0",
    color: "#000",
    lineHeight: "1.2",
  };

  const subtitleStyle = {
    fontSize: "16px",
    color: "#222",
    margin: "0 0 40px 0",
    fontWeight: "500",
    lineHeight: "1.5",
  };

  const buttonContainerStyle = {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  };

  const getButtonStyle = (buttonType: string) => ({
    width: "100%",
    padding: "18px 24px",
    backgroundColor: buttonType === "ver" ? "#000" : "#fff",
    color: buttonType === "ver" ? "#fff" : "#000",
    border: buttonType === "ver" ? "2px solid #fff" : "2px solid #000",
    borderRadius: "16px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow:
      buttonType === "ver"
        ? "0 4px 16px rgba(0,0,0,0.15)"
        : "0 4px 16px rgba(0,0,0,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    textTransform: "none" as const,
    letterSpacing: "0.5px",
    transform:
      hoveredButton === buttonType ? "translateY(-2px)" : "translateY(0)",
    ...(hoveredButton === buttonType && {
      backgroundColor: buttonType === "ver" ? "#222" : "#e1e5e9",
      color: buttonType === "ver" ? "#fff" : "#000",
      boxShadow:
        buttonType === "ver"
          ? "0 8px 24px rgba(0,0,0,0.18)"
          : "0 8px 24px rgba(0,0,0,0.10)",
    }),
  });

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={"/fotoClaudia.jpeg"}
            alt="Claudia Echavarry"
            style={{
              width: 260,
              height: "auto",
              maxWidth: "100%",
              objectFit: "contain",
              marginBottom: 18,
              boxShadow: "none",
              border: "none",
            }}
          />
          <h1 style={{ ...titleStyle, textAlign: "center" }}>TURNOS</h1>
        </div>
        <div style={buttonContainerStyle}>
          <button
            style={getButtonStyle("ver")}
            onClick={() => navigate("/ver-turnos")}
            onMouseEnter={() => setHoveredButton("ver")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            VER TURNOS
          </button>

          <button
            style={getButtonStyle("add")}
            onClick={() => navigate("/alta-turno")}
            onMouseEnter={() => setHoveredButton("add")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            AÑADIR NUEVO TURNO
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
