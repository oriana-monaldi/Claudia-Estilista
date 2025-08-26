"use client";

import { useState } from "react";
import { AltaTurno } from "./components/AltaTurno";
import { VerTurnos } from "./components/VerTurnos";
import { ModificarTurno } from "./components/ModificarTurno";
import type { Turno } from "./types";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";

const estilosInputs = `
  .input-principal {
    width: 100% !important;
    min-width: 280px;
    max-width: 100%;
    padding: 16px 20px;
    font-size: 16px;
    border: 2px solid #f1f5f9;
    border-radius: 12px;
    box-sizing: border-box;
    transition: all 0.3s ease;
    background: white;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  
  .input-principal:focus {
    outline: none;
    border-color: #ff6b9d;
    box-shadow: 0 0 0 4px rgba(255, 107, 157, 0.1);
    transform: translateY(-1px);
  }
  
  .select-principal {
    width: 100% !important;
    min-width: 280px;
    max-width: 100%;
    padding: 16px 20px;
    font-size: 16px;
    border: 2px solid #f1f5f9;
    border-radius: 12px;
    box-sizing: border-box;
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  
  .select-principal:focus {
    outline: none;
    border-color: #ff6b9d;
    box-shadow: 0 0 0 4px rgba(255, 107, 157, 0.1);
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    .input-principal,
    .select-principal {
      min-width: 250px;
      font-size: 16px;
      padding: 14px 18px;
    }
  }
  
  @media (max-width: 480px) {
    .input-principal,
    .select-principal {
      min-width: calc(100vw - 70px);
      padding: 12px 16px;
    }
  }
`;

function App() {
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<Turno | null>(
    null
  );
  const [refresh, setRefresh] = useState<number>(0);

  const refrescarLista = () => {
    setRefresh(refresh + 1);
  };

  const cancelarModificacion = () => {
    setTurnoSeleccionado(null);
  };

  return (
    <BrowserRouter>
      <style>{estilosInputs}</style>
      <div
        style={{
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0",
          background: "#fff",
          minHeight: "100svh",
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/alta-turno"
            element={
              <section
                style={{
                  background: "#fff",
                  borderRadius: "20px",
                  padding: "32px 0",
                  marginBottom: "24px",
                  boxShadow: "none",
                  width: "100%",
                  maxWidth: "100%",
                }}
              >
                <h2
                  style={{
                    color: "#000",
                    borderBottom: "3px solid #000",
                    paddingBottom: "12px",
                    marginTop: "0",
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    marginBottom: "24px",
                  }}
                >
                  Nuevo Turno
                </h2>
                <AltaTurno onTurnoRegistrado={refrescarLista} />
              </section>
            }
          />
          <Route
            path="/ver-turnos"
            element={
              <section
                style={{
                  background: "#fff",
                  borderRadius: "20px",
                  padding: "32px 0",
                  boxShadow: "none",
                  width: "100%",
                  maxWidth: "100%",
                }}
              >
                <h2
                  style={{
                    color: "#000",
                    borderBottom: "3px solid #000",
                    paddingBottom: "12px",
                    marginTop: "0",
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    marginBottom: "24px",
                  }}
                >
                  Turnos Programados
                </h2>
                <VerTurnos
                  key={refresh.toString()}
                  onSeleccionarTurno={setTurnoSeleccionado}
                  onNuevoTurno={refrescarLista}
                />
              </section>
            }
          />
        </Routes>

        {turnoSeleccionado && (
          <section
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "32px 0",
              boxShadow: "none",
              marginTop: "24px",
              width: "100%",
              maxWidth: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <h2
                style={{
                  color: "#000",
                  borderBottom: "3px solid #000",
                  paddingBottom: "12px",
                  margin: "0",
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  minWidth: "0",
                }}
              >
                Modificar Turno
              </h2>
              <button
                onClick={cancelarModificacion}
                style={{
                  background: "#e5e7eb",
                  color: "#000",
                  border: "1.5px solid #222",
                  borderRadius: "12px",
                  padding: "12px 24px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLButtonElement).style.background = "#d1d5db";
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLButtonElement).style.background = "#e5e7eb";
                }}
              >
                ✕ Cancelar
              </button>
            </div>
            <ModificarTurno
              turno={turnoSeleccionado}
              onTurnoActualizado={refrescarLista}
            />
          </section>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
