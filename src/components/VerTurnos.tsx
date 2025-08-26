"use client";

import { useEffect, useState } from "react";
import type { Turno } from "../types";
import { getTurnos, deleteTurno } from "../assets/utils/localStorageTurnos";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

interface Props {
  onSeleccionarTurno: (turno: Turno) => void;
  onNuevoTurno: () => void;
}

export function VerTurnos({ onSeleccionarTurno, onNuevoTurno }: Props) {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filtroFecha, setFiltroFecha] = useState<string>("hoy");
  const [fechaPersonalizada, setFechaPersonalizada] = useState<string>("");
  const [busquedaNombre, setBusquedaNombre] = useState<string>("");

  const cargarTurnos = async () => {
    setLoading(true);
    try {
      const data = await getTurnos();
      setTurnos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar turnos:", error);
      setTurnos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTurnos();
  }, []);

  const handleDelete = async (id: string) => {
    const swalWithCustomButtons = Swal.mixin({
      customClass: {
        confirmButton: "swal-btn-confirm",
        cancelButton: "swal-btn-cancel",
      },
      buttonsStyling: false,
    });

    const result = await swalWithCustomButtons.fire({
      title: "¿Está seguro que desea eliminar el turno?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setDeletingId(id);
      try {
        await deleteTurno(id);
        await cargarTurnos();
        await swalWithCustomButtons.fire({
          title: "¡Eliminado!",
          text: "El turno ha sido eliminado.",
          icon: "success",
          showConfirmButton: false,
          timer: 2100,
          timerProgressBar: true,
        });
      } catch (error) {
        console.error("Error al eliminar turno:", error);
      } finally {
        setDeletingId(null);
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      await swalWithCustomButtons.fire({
        title: "Cancelado",
        text: "El turno NO se ha eliminado",
        icon: "error",
        showConfirmButton: false,
        timer: 2100,
        timerProgressBar: true,
      });
    }
  };

  const getHoy = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const esFechaFutura = (fecha: string) => {
    if (!fecha) return false;
    const hoy = new Date();
    const fechaTurno = new Date(fecha + "T00:00:00");
    hoy.setHours(0, 0, 0, 0);
    return fechaTurno >= hoy;
  };

  const turnosFiltrados = turnos.filter((turno) => {
    if (!esFechaFutura(turno.fecha)) return false;

    if (busquedaNombre.trim()) {
      const nombreBusqueda = busquedaNombre.toLowerCase().trim();
      const nombreTurno = turno.nombre.toLowerCase();
      if (!nombreTurno.includes(nombreBusqueda)) return false;
    }

    if (filtroFecha === "hoy") {
      return turno.fecha === getHoy();
    } else if (filtroFecha === "todos") {
      return true;
    } else if (filtroFecha === "personalizada" && fechaPersonalizada) {
      return turno.fecha === fechaPersonalizada;
    }
    return true;
  });

  const turnosOrdenados = turnosFiltrados.sort((a, b) => {
    const fechaA = new Date(a.fecha + "T" + a.hora);
    const fechaB = new Date(b.fecha + "T" + b.hora);
    return fechaA.getTime() - fechaB.getTime();
  });

  const getTituloFiltro = () => {
    let titulo = "";
    if (filtroFecha === "hoy") titulo = "Turnos de hoy";
    else if (filtroFecha === "personalizada" && fechaPersonalizada) {
      const fecha = new Date(fechaPersonalizada + "T00:00:00");
      titulo = `Turnos del ${fecha.getDate()}/${
        fecha.getMonth() + 1
      }/${fecha.getFullYear()}`;
    } else {
      titulo = "Próximos turnos";
    }

    if (busquedaNombre.trim()) {
      titulo += ` - "${busquedaNombre.trim()}"`;
    }

    return titulo;
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "20px",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "60px 20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "4px solid #f1f5f9",
              borderTop: "4px solid #000",
              borderRadius: "50%",
              animation: "spin 1.2s linear infinite",
              marginBottom: "20px",
            }}
          ></div>
          <p
            style={{
              color: "#222",
              fontSize: "16px",
              margin: "0",
              fontWeight: "500",
            }}
          >
            Cargando turnos...
          </p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "800",
              margin: "0 0 8px 0",
              color: "#000",
              letterSpacing: "1px",
            }}
          >
            ✂️ {getTituloFiltro()}
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "#64748b",
              margin: "0",
              fontWeight: "500",
            }}
          >
            {turnosOrdenados.length} turno
            {turnosOrdenados.length !== 1 ? "s" : ""} próximo
            {turnosOrdenados.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#fff",
          padding: "16px 12px",
          borderRadius: "12px",
          boxShadow: "none",
          marginBottom: "24px",
          maxWidth: "480px",
          width: "100%",
          margin: "0 auto 24px auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#000",
            margin: "0 0 16px 0",
            textAlign: "center",
          }}
        >
          🔍 Filtrar turnos
        </h3>

        <div style={{ marginBottom: "20px" }}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#374151",
              margin: "0 0 16px 0",
            }}
          >
            Buscar turno por nombre
          </h3>
          <input
            type="text"
            placeholder="🔎 Filtar por nombre o apellido"
            value={busquedaNombre}
            onChange={(e) => setBusquedaNombre(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              border: "2px solid #e1e5e9",
              borderRadius: "12px",
              fontSize: "16px",
              fontFamily: "inherit",
              backgroundColor: "#fff",
              transition: "all 0.2s ease",
              outline: "none",
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#ff6b9d";
              e.target.style.boxShadow = "0 0 0 3px rgba(255, 107, 157, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e1e5e9";
              e.target.style.boxShadow = "none";
            }}
          />
          {busquedaNombre && (
            <div
              style={{
                marginTop: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                  fontWeight: "500",
                }}
              >
                Buscando: "{busquedaNombre}"
              </span>
              <button
                onClick={() => setBusquedaNombre("")}
                style={{
                  padding: "4px 8px",
                  backgroundColor: "#f1f5f9",
                  color: "#64748b",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.backgroundColor = "#e2e8f0";
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.backgroundColor = "#f1f5f9";
                }}
              >
                ✕ Limpiar
              </button>
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: filtroFecha === "personalizada" ? "16px" : "0",
          }}
        >
          <button
            onClick={() => setFiltroFecha("hoy")}
            style={{
              padding: "10px 16px",
              backgroundColor: filtroFecha === "hoy" ? "#000" : "#f8fafc",
              color: filtroFecha === "hoy" ? "#fff" : "#222",
              border: "1.5px solid #222",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              outline: "none",
            }}
          >
            📅 Hoy
          </button>

          <button
            onClick={() => setFiltroFecha("todos")}
            style={{
              padding: "10px 16px",
              backgroundColor: filtroFecha === "todos" ? "#000" : "#f8fafc",
              color: filtroFecha === "todos" ? "#fff" : "#222",
              border: "1.5px solid #222",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              outline: "none",
            }}
          >
            📋 Todos los próximos
          </button>

          <button
            onClick={() => setFiltroFecha("personalizada")}
            style={{
              padding: "10px 16px",
              backgroundColor:
                filtroFecha === "personalizada" ? "#000" : "#f8fafc",
              color: filtroFecha === "personalizada" ? "#fff" : "#222",
              border: "1.5px solid #222",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              outline: "none",
            }}
          >
            🎯 Fecha específica
          </button>
        </div>

        {filtroFecha === "personalizada" && (
          <div style={{ marginTop: "16px" }}>
            <input
              type="date"
              value={fechaPersonalizada}
              onChange={(e) => setFechaPersonalizada(e.target.value)}
              min={getHoy()}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e1e5e9",
                borderRadius: "12px",
                fontSize: "16px",
                fontFamily: "inherit",
                backgroundColor: "#fff",
                transition: "all 0.2s ease",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#ff6b9d";
                e.target.style.boxShadow = "0 0 0 3px rgba(255, 107, 157, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e1e5e9";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        )}
      </div>

      {turnosOrdenados.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            backgroundColor: "#fff",
            borderRadius: "20px",
            // border: "2px dashed #e2e8f0",
            background: "linear-gradient(135deg, #fff 0%, #fdf2f8 100%)",
          }}
        >
          <div
            style={{
              fontSize: "64px",
              marginBottom: "20px",
              opacity: "0.8",
            }}
          >
            {filtroFecha === "hoy" ? "📅" : "💇‍♀️"}
          </div>
          <h3
            style={{
              fontSize: "22px",
              color: "#1e293b",
              margin: "0 0 12px 0",
              fontWeight: "700",
            }}
          >
            {busquedaNombre.trim()
              ? `No se encontraron clientes con "${busquedaNombre.trim()}"`
              : filtroFecha === "hoy"
              ? "No tienes turnos para hoy"
              : "No hay turnos próximos"}
          </h3>
          <p
            style={{
              fontSize: "16px",
              color: "#64748b",
              margin: "0 0 32px 0",
              lineHeight: "1.6",
            }}
          >
            {busquedaNombre.trim()
              ? "Intenta con otro nombre o revisa la ortografía"
              : filtroFecha === "hoy"
              ? "¡Aprovecha para relajarte o agenda uno para mañana!"
              : "¡Agenda tu próximo turno y luce espectacular!"}
          </p>
          <button
            onClick={onNuevoTurno}
            style={{
              padding: "18px 36px",
              backgroundColor: "#ff6b9d",
              color: "white",
              border: "none",
              borderRadius: "30px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(255, 107, 157, 0.4)",
              transition: "all 0.2s ease",
              outline: "none",
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.backgroundColor = "#e55a87";
              target.style.transform = "translateY(-3px)";
              target.style.boxShadow = "0 8px 25px rgba(255, 107, 157, 0.5)";
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.backgroundColor = "#ff6b9d";
              target.style.transform = "translateY(0)";
              target.style.boxShadow = "0 6px 20px rgba(255, 107, 157, 0.4)";
            }}
          >
            ✨ Agendar Turno
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {turnosOrdenados.map((turno) => (
            <div
              key={turno.id}
              style={{
                backgroundColor: "#fff",
                padding: "24px",
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                // border: "1.5px solid #222",
                transition: "all 0.2s ease",
              }}
              onTouchStart={(e) => {
                const target = e.currentTarget as HTMLDivElement;
                target.style.transform = "scale(0.98)";
              }}
              onTouchEnd={(e) => {
                const target = e.currentTarget as HTMLDivElement;
                target.style.transform = "scale(1)";
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#1e293b",
                    margin: "0 0 12px 0",
                    lineHeight: "1.3",
                    maxWidth: "100%",
                    overflow: "hidden",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                  }}
                >
                  👤 {turno.nombre}
                </h3>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    marginBottom: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      backgroundColor:
                        turno.fecha === getHoy() ? "#ecfdf5" : "#f8fafc",
                      padding: "8px 12px",
                      borderRadius: "12px",
                      border:
                        turno.fecha === getHoy() ? "1px solid #a7f3d0" : "none",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>📅</span>
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: "600",
                        color: turno.fecha === getHoy() ? "#065f46" : "#475569",
                      }}
                    >
                      {(() => {
                        if (!turno.fecha || typeof turno.fecha !== "string")
                          return turno.fecha || "Sin fecha";
                        const parts = turno.fecha.split("-");
                        if (parts.length !== 3) return turno.fecha;
                        const [year, month, day] = parts;
                        return `${day}/${month}/${year}`;
                      })()}
                      {turno.fecha === getHoy() && (
                        <span
                          style={{
                            marginLeft: "6px",
                            fontSize: "12px",
                            backgroundColor: "#10b981",
                            color: "white",
                            padding: "2px 6px",
                            borderRadius: "6px",
                            fontWeight: "700",
                          }}
                        >
                          HOY
                        </span>
                      )}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      backgroundColor: "#f8fafc",
                      padding: "8px 12px",
                      borderRadius: "12px",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>🕐</span>
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: "600",
                        color: "#475569",
                      }}
                    >
                      {turno.hora}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "16px",
                  }}
                >
                  <span style={{ fontSize: "16px" }}>📱</span>
                  <span
                    style={{
                      fontSize: "15px",
                      color: "#64748b",
                      fontWeight: "500",
                      maxWidth: "180px",
                      overflow: "hidden",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      display: "inline-block",
                      verticalAlign: "bottom",
                    }}
                  >
                    {turno.telefono}
                  </span>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "#f8fafc",
                  padding: "16px",
                  borderRadius: "16px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "6px",
                  }}
                >
                  Servicio solicitado
                </div>
                <div
                  style={{
                    fontSize: "17px",
                    fontWeight: "700",
                    color: "#334155",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    maxWidth: "100%",
                    overflow: "hidden",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                  }}
                >
                  <span>✨</span>
                  <span
                    style={{
                      overflow: "hidden",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      display: "inline-block",
                      maxWidth: "160px",
                    }}
                  >
                    {turno.servicio}
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                }}
              >
                <button
                  onClick={() => onSeleccionarTurno(turno)}
                  style={{
                    flex: "1",
                    padding: "14px",
                    backgroundColor: "#000",
                    color: "#fff",
                    border: "1.5px solid #222",
                    borderRadius: "14px",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    outline: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.backgroundColor = "#2563eb";
                    target.style.transform = "translateY(-1px)";
                    target.style.boxShadow =
                      "0 4px 12px rgba(59, 130, 246, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.backgroundColor = "#3b82f6";
                    target.style.transform = "translateY(0)";
                    target.style.boxShadow =
                      "0 2px 8px rgba(59, 130, 246, 0.3)";
                  }}
                >
                  ✏️ Editar
                </button>

                <button
                  onClick={() => handleDelete(turno.id)}
                  disabled={deletingId === turno.id}
                  style={{
                    flex: "1",
                    padding: "14px",
                    backgroundColor:
                      deletingId === turno.id ? "#e5e7eb" : "#ef4444",
                    color: deletingId === turno.id ? "#222" : "#fff",
                    border: "1.5px solid #ef4444",
                    borderRadius: "14px",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor: deletingId === turno.id ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                    outline: "none",
                    boxShadow:
                      deletingId === turno.id
                        ? "none"
                        : "0 2px 8px rgba(239,68,68,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    if (deletingId !== turno.id) {
                      const target = e.target as HTMLButtonElement;
                      target.style.backgroundColor = "#dc2626";
                      target.style.transform = "translateY(-1px)";
                      target.style.boxShadow =
                        "0 4px 12px rgba(239, 68, 68, 0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (deletingId !== turno.id) {
                      const target = e.target as HTMLButtonElement;
                      target.style.backgroundColor = "#ef4444";
                      target.style.transform = "translateY(0)";
                      target.style.boxShadow =
                        "0 2px 8px rgba(239, 68, 68, 0.3)";
                    }
                  }}
                >
                  {deletingId === turno.id ? (
                    <>
                      <div
                        style={{
                          display: "inline-block",
                          width: "16px",
                          height: "16px",
                          border: "2px solid #64748b",
                          borderTop: "2px solid transparent",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                          marginRight: "8px",
                        }}
                      ></div>
                      Eliminando...
                    </>
                  ) : (
                    <>🗑️ Eliminar</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .swal-btn-confirm {
          background: #ef4444 !important;
          color: #fff !important;
          border: none !important;
          border-radius: 8px !important;
          font-weight: 700 !important;
          font-size: 15px !important;
          padding: 10px 28px !important;
          margin: 0 8px !important;
          cursor: pointer !important;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
          transition: background 0.2s;
        }
        .swal-btn-confirm:hover {
          background: #dc2626 !important;
        }
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
        .swal-btn-cancel:hover {
          background: #e2e8f0 !important;
        }
      `}</style>
    </div>
  );
}
