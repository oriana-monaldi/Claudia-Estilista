"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const containerStyle = {
    minHeight: "100vh",
    width: "100vw",
    background: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    overflowX: "hidden" as "hidden",
    boxSizing: "border-box" as "border-box",
    margin: "0",
    position: "fixed" as "fixed",
    top: "0",
    left: "0",
  };

  const cardStyle = {
    backgroundColor: "transparent",
    borderRadius: 0,
    padding: "20px",
    boxShadow: "none",
    textAlign: "center" as const,
    maxWidth: "420px",
    width: "100%",
    margin: "0 auto",
    transform: "none",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
  };

  const buttonContainerStyle = {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  };

  const baseButtonStyle = {
    width: "100%",
    padding: "18px 22px",
    border: "2px solid #fff",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    textTransform: "none" as const,
    letterSpacing: "0.5px",
    background: "#000",
    color: "#fff",
  };

  const getButtonStyle = (buttonType: string) => ({
    ...baseButtonStyle,
    background: hoveredButton === buttonType ? "#fff" : "#000",
    color: hoveredButton === buttonType ? "#000" : "#fff",
    transform:
      hoveredButton === buttonType ? "translateY(-2px)" : "translateY(0)",
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

          <button
            style={getButtonStyle("consultas")}
            onClick={() => navigate("/consultas")}
            onMouseEnter={() => setHoveredButton("consultas")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            CONSULTAS
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
