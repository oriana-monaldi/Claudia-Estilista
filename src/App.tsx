"use client";

import { useState } from "react";
import { AltaTurno } from "./components/AltaTurno";
import AltaConsulta from "./components/AltaConsulta";
import { VerTurnos } from "./components/VerTurnos";
import { ModificarTurno } from "./components/ModificarTurno";
import Consultas from "./components/Consultas";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";
import EditarConsulta from "./components/EditarConsulta";

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
    background: #fff;
    border: 2px solid #e1e5e9;
    color: #333;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  
  .input-principal:focus {
    outline: none;
    border: none;
    box-shadow: 0 0 0 2px #BBA2A0;
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
    background: #fff;
    border: 2px solid #e1e5e9;
    color: #333;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  
  .select-principal:focus {
    outline: none;
    border: none;
    box-shadow: 0 0 0 2px #BBA2A0;
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
          background: #fff !important;
          color: #000 !important;
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
        <style>{`
          .swal-btn-confirm {
            background: #BBA2A0 !important;
            color: #fff !important;
            border: none !important;
            border-radius: 8px !important;
            font-weight: 700 !important;
            font-size: 15px !important;
            padding: 10px 28px !important;
            margin: 0 8px !important;
            cursor: pointer !important;
            box-shadow: 0 2px 8px rgba(187, 162, 160, 0.3);
            transition: background 0.2s;
          }
          .swal-btn-confirm:hover { background: #A08E8D !important; }
          .swal-btn-cancel {
            background: #f1f5f9 !important;
            color: #64748b !important;
            border: none !important;
            border-radius: 8px !important;
            font-weight: 700 !important;
            font-size: 15px !important;
            padding: 10px 28px !important;
            margin: 0 8px !important;
            cursor: pointer !important;
            box-shadow: 0 2px 8px rgba(100, 116, 139, 0.1);
            transition: background 0.2s;
          }
          .swal-btn-cancel:hover { background: #e2e8f0 !important; }
          .swal-warning-icon { border-color: #BBA2A0 !important; color: #BBA2A0 !important; }
          .swal2-icon.swal2-warning { border-color: #BBA2A0 !important; color: #BBA2A0 !important; }
          .swal2-icon.swal2-warning .swal2-icon-content { color: #BBA2A0 !important; }
          /* Success popup improvements */
          .swal2-popup {
            border-radius: 12px !important;
            box-shadow: 0 12px 40px rgba(2,6,23,0.08) !important;
            padding: 20px !important;
          }
          .swal2-title {
            font-weight: 800 !important;
            font-size: 18px !important;
            color: #0f172a !important; /* darker */
          }
          .swal2-html-container {
            color: #475569 !important;
            font-size: 14px !important;
          }
          .swal2-icon.swal2-success {
            border-color: #34D399 !important;
            color: #34D399 !important;
          }
          .swal2-icon.swal2-success .swal2-success-line-tip,
          .swal2-icon.swal2-success .swal2-success-line-long {
            background: #34D399 !important;
          }
          .swal2-icon.swal2-success .swal2-success-ring {
            stroke: rgba(52,211,153,0.16) !important;
          }
        `}</style>
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
          <Route path="/alta-consulta" element={<AltaConsulta />} />
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
          <Route path="/consultas" element={<Consultas />} />
          <Route path="/editar-consulta/:id" element={<EditarConsulta />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
