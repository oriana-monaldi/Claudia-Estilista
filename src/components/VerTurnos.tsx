"use client";

import { useEffect, useState } from "react";
import type { Turno } from "../types";
import { useNavigate } from "react-router-dom";
import { getTurnos, deleteTurno } from "../assets/utils/localStorageTurnos";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "sweetalert2/dist/sweetalert2.min.css";

export function VerTurnos() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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

    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split("T")[0];
      return turno.fecha === dateStr;
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
        padding: "10px 0 0 0",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        maxWidth: "480px",
        margin: "0 auto",
      }}
    >
      {/* TÍTULO Y SUBTÍTULO */}
      <div style={{ marginBottom: "16px", textAlign: "center" }}>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 800,
            color: "#000",
            margin: 0,
            letterSpacing: "1px",
          }}
        >
          ✂️ {getTituloFiltro()}
        </h2>
        <p
          style={{
            fontSize: "14px",
            color: "#64748b",
            margin: 0,
            fontWeight: 500,
          }}
        >
          {turnosOrdenados.length} turno
          {turnosOrdenados.length !== 1 ? "s" : ""} próximo
          {turnosOrdenados.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          padding: "16px 12px 12px 12px",
          marginBottom: "18px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <h4 style={{ margin: "0 0 4px 0", fontWeight: 700 }}>
          Filtrar por nombre o apellido
        </h4>
        <input
          type="text"
          placeholder="🔎 Filtrar por nombre o apellido"
          value={busquedaNombre}
          onChange={(e) => setBusquedaNombre(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 14px",
            border: "1.5px solid #e1e5e9",
            borderRadius: "10px",
            fontSize: "15px",
            fontFamily: "inherit",
            backgroundColor: "#f8fafc",
            outline: "none",
            boxSizing: "border-box",
            marginBottom: "2px",
          }}
        />
        <h5>Filtrar por:</h5>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <button
            onClick={() => setFiltroFecha("hoy")}
            style={{
              padding: "8px 12px",
              backgroundColor: filtroFecha === "hoy" ? "#000" : "#f8fafc",
              color: filtroFecha === "hoy" ? "#fff" : "#222",
              border: "1.5px solid #222",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              outline: "none",
              transition: "all 0.2s",
            }}
          >
            📅 Hoy
          </button>
          <button
            onClick={() => setFiltroFecha("todos")}
            style={{
              padding: "8px 12px",
              backgroundColor: filtroFecha === "todos" ? "#000" : "#f8fafc",
              color: filtroFecha === "todos" ? "#fff" : "#222",
              border: "1.5px solid #222",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              outline: "none",
              transition: "all 0.2s",
            }}
          >
            📋 Todos los próximos
          </button>
        </div>
        {filtroFecha === "personalizada" && (
          <input
            type="date"
            value={fechaPersonalizada}
            onChange={(e) => setFechaPersonalizada(e.target.value)}
            min={getHoy()}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1.5px solid #e1e5e9",
              borderRadius: "10px",
              fontSize: "15px",
              fontFamily: "inherit",
              backgroundColor: "#f8fafc",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        )}
      </div>

      <div
        style={{
          marginBottom: "12px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null, _event: any) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          inline
          placeholderText="Elegí una fecha"
          dayClassName={(date) => {
            const today = new Date();
            const isToday =
              date.getDate() === today.getDate() &&
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear();
            return isToday ? "react-datepicker__day--today-highlight" : "";
          }}
        />
        <style>{`
          .react-datepicker__day--today-highlight {
            background: #000 !important;
            color: #fff !important;
            border-radius: 50% !important;
          }
        `}</style>
      </div>

      {turnosOrdenados.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            backgroundColor: "#fff",
            borderRadius: "20px",
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
              ? "No tenes turnos para hoy"
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
              ? ""
              : "¡Agenda tu próximo turno!"}
          </p>
          <button
            onClick={() => navigate("/alta-turno")}
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
                  onClick={() =>
                    navigate("/modificar-turno", { state: { turno } })
                  }
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
