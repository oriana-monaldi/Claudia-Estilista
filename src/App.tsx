"use client";

import { useState } from "react";
import { AltaTurno } from "./components/AltaTurno";
import { VerTurnos } from "./components/VerTurnos";
import { ModificarTurno } from "./components/ModificarTurno";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";

const estilosInputs = `
  .input-principal {
    width: 100% !important;
    min-width: 280px;
    max-width: 100%;
    padding: 16px 20px;
    font-size: 16px;
    border-radius: 12px;
    box-sizing: border-box;
    transition: all 0.3s ease;
    background: #222;
    border: none;
    color: #fff;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  
  .input-principal:focus {
    outline: none;
    border: none;
    box-shadow: 0 0 0 2px #ff6b9d;
    transform: translateY(-1px);
  }
  
  .select-principal {
    width: 100% !important;
    min-width: 280px;
    max-width: 100%;
    padding: 16px 20px;
    font-size: 16px;
    border-radius: 12px;
    box-sizing: border-box;
    background: #222;
    border: none;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  
  .select-principal:focus {
    outline: none;
    border: none;
    box-shadow: 0 0 0 2px #ff6b9d;
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

function ModificarTurnoWrapper({
  onTurnoActualizado,
}: {
  onTurnoActualizado: () => void;
}) {
  const location = useLocation();
  const turno = location.state?.turno;
  if (!turno) {
    return (
      <div
        style={{
          padding: 32,
          textAlign: "center",
          color: "#c00",
          fontWeight: 600,
        }}
      >
        No hay turno seleccionado para modificar.
      </div>
    );
  }
  return (
    <ModificarTurno turno={turno} onTurnoActualizado={onTurnoActualizado} />
  );
}

function App() {
  const [refresh, setRefresh] = useState<number>(0);
  const refrescarLista = () => setRefresh(refresh + 1);

  return (
    <BrowserRouter>
      <style>{`
        html, body {
          background: #000 !important;
          color: #fff !important;
          min-height: 100vh;
          width: 100vw;
          margin: 0;
          padding: 0;
          overflow-y: hidden !important;
        }
        #root {
          min-height: 100vh;
          overflow-y: hidden !important;
        }
      `}</style>
      <style>{estilosInputs}</style>
      <div
        style={{
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0",
          background: "#000",
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
                  background: "transparent",
                  borderRadius: 0,
                  padding: 0,
                  marginBottom: 0,
                  boxShadow: "none",
                  width: "100%",
                  maxWidth: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
              
                <AltaTurno onTurnoRegistrado={refrescarLista} />
              </section>
            }
          />
          <Route
            path="/ver-turnos"
            element={
              <section
                style={{
                  background: "transparent",
                  borderRadius: 0,
                  padding: 0,
                  boxShadow: "none",
                  width: "100%",
                  maxWidth: "100%",
                }}
              >
                <VerTurnos key={refresh.toString()} />
              </section>
            }
          />
          <Route
            path="/modificar-turno"
            element={
              <ModificarTurnoWrapper onTurnoActualizado={refrescarLista} />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
