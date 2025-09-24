"use client";

import { useEffect, useState } from "react";
import type { Turno } from "../types";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getTurnos, deleteTurno } from "../assets/utils/localStorageTurnos";
import { HeaderBar } from "./HeaderBar";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "sweetalert2/dist/sweetalert2.min.css";

export function VerTurnos() {
  const cargarTurnos = async () => {
    setLoading(true);
    try {
      const data = await getTurnos();
      setTurnos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar turnos:", error);
      setTurnos([]);
    } finally {
      // Esperar 1 segundo antes de ocultar el cargando
      setTimeout(() => setLoading(false), 1000);
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
        icon: "swal-warning-icon",
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
  const navigate = useNavigate();
  const location = useLocation();
  const [showReciente, setShowReciente] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filtroFecha, setFiltroFecha] = useState<string>("hoy");
  const [fechaPersonalizada, setFechaPersonalizada] = useState<string>("");
  const [busquedaNombre, setBusquedaNombre] = useState<string>("");
  useEffect(() => {
    if (location.state && showReciente) {
      const { nombre, fecha } = location.state as {
        nombre?: string;
        fecha?: string;
      };
      if (nombre) setBusquedaNombre(nombre);
      if (fecha) {
        const [year, month, day] = fecha.split("-");
        setSelectedDate(new Date(Number(year), Number(month) - 1, Number(day)));
      }
      setShowReciente(false);
    } else if (!location.state && showReciente) {
      setBusquedaNombre("");
      const hoy = new Date();
      setSelectedDate(
        new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
      );
      setShowReciente(false);
    }
  }, [location.state, showReciente]);

  const getHoy = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const esFechaFutura = (fecha: string) => {
    if (!fecha) return false;
    const hoy = new Date();
    const fechaTurno = new Date(fecha + "T00:00:00");
    hoy.setHours(0, 0, 0, 0);
    return fechaTurno >= hoy;
  };

  let turnosFiltrados = turnos.filter((turno) => {
    if (filtroFecha === "todos") {
      return esFechaFutura(turno.fecha);
    } else if (filtroFecha === "hoy") {
      return turno.fecha === getHoy();
    } else if (filtroFecha === "personalizada" && fechaPersonalizada) {
      return turno.fecha === fechaPersonalizada;
    }
    return true;
  });

  if (busquedaNombre.trim()) {
    const nombreBusqueda = busquedaNombre.toLowerCase().trim();
    turnosFiltrados = turnosFiltrados.filter((turno) => {
      const nombreTurno = turno.nombre.toLowerCase();
      return nombreTurno.includes(nombreBusqueda);
    });
  }

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
              color: "#fff",
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
        width: "100vw",
        minHeight: "100vh",
        background: "#fff",
        overflowY: "auto",
        maxHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "0",
      }}
    >
      <div
        style={{
          padding: "16px",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          maxWidth: "400px",
          width: "100%",
          background: "#fff",
          minHeight: "100vh",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            position: "relative",
            top: 0,
            left: 0,
            background: "#fff",
            border: "none",
            color: "#000",
            fontSize: 28,
            cursor: "pointer",
            zIndex: 100,
            padding: 4,
            borderRadius: 24,
            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
            display: "flex",
            alignItems: "center",
            marginBottom: 8,
          }}
          aria-label="Volver al Home"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 6L9 12L15 18"
              stroke="#000"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <HeaderBar>
          <span style={{ fontSize: 16 }}>✂️ {getTituloFiltro()}</span>
        </HeaderBar>
        <p
          style={{
            fontSize: "14px",
            color: "#64748b",
            margin: "16px 0",
            fontWeight: 500,
          }}
        >
          {turnosOrdenados.length} TURNOS
        </p>
        <div style={{ margin: "16px 0" }}>
          <input
            type="text"
            placeholder="Buscar por nombre o apellido"
            value={busquedaNombre}
            onChange={(e) => setBusquedaNombre(e.target.value)}
            className="input-principal"
            style={{
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
              boxSizing: "border-box",
            }}
          />
        </div>
        <div
          style={{
            background: "#f8fafc",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            padding: "16px",
            marginBottom: "18px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            border: "2px solid #e1e5e9",
          }}
        >
          <h5
            style={{
              color: "#222",
              margin: 0,
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Filtrar por fecha:
          </h5>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setFiltroFecha("hoy")}
              style={{
                flex: 1,
                padding: "12px 16px",
                backgroundColor: filtroFecha === "hoy" ? "#BBA2A0" : "#fff",
                color: filtroFecha === "hoy" ? "#fff" : "#222",
                border: "2px solid #BBA2A0",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                outline: "none",
                transition: "all 0.2s ease",
                boxShadow:
                  filtroFecha === "hoy"
                    ? "0 4px 12px rgba(187, 162, 160, 0.3)"
                    : "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              HOY
            </button>
            <button
              onClick={() => setFiltroFecha("todos")}
              style={{
                flex: 1,
                padding: "12px 16px",
                backgroundColor: filtroFecha === "todos" ? "#BBA2A0" : "#fff",
                color: filtroFecha === "todos" ? "#fff" : "#222",
                border: "2px solid #BBA2A0",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                outline: "none",
                transition: "all 0.2s ease",
                boxShadow:
                  filtroFecha === "todos"
                    ? "0 4px 12px rgba(187, 162, 160, 0.3)"
                    : "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              TODOS
            </button>
          </div>
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
            onChange={(date: Date | null, _event: any) => {
              setSelectedDate(date);
              if (date) {
                const fechaStr = date.toISOString().split("T")[0];
                setFechaPersonalizada(fechaStr);
                setFiltroFecha("personalizada");
              }
            }}
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
            background: #222 !important;
            color: #fff !important;
            border-radius: 50% !important;
          }
          .react-datepicker__day {
            background: #fff !important;
            color: #222 !important;
          }
          .react-datepicker__day--selected {
            background: #222 !important;
            color: #fff !important;
          }
          .react-datepicker__header {
            background: #fff !important;
            color: #222 !important;
            border-bottom: 1px solid #e2e8f0 !important;
          }
          .react-datepicker__current-month, .react-datepicker-time__header, .react-datepicker-year-header {
            color: #222 !important;
          }
          .react-datepicker__day-name {
            color: #222 !important;
          }
        `}</style>
        </div>

        {turnosOrdenados.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              backgroundColor: "#f8fafc",
              borderRadius: "20px",
              border: "1.5px solid #e2e8f0",
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
                color: "#222",
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
                backgroundColor: "#BBA2A0",
                color: "white",
                border: "2px solid #BBA2A0",
                borderRadius: "30px",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(187, 162, 160, 0.2)",
                transition: "all 0.2s ease",
                outline: "none",
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.backgroundColor = "#A08E8D";
                target.style.transform = "translateY(-3px)";
                target.style.boxShadow = "0 8px 25px rgba(187, 162, 160, 0.3)";
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.backgroundColor = "#BBA2A0";
                target.style.transform = "translateY(0)";
                target.style.boxShadow = "0 6px 20px rgba(187, 162, 160, 0.2)";
              }}
            >
              Agendar Turno
            </button>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {turnosOrdenados.map((turno) => (
              <div
                key={turno.id}
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #fefefe 100%)",
                  padding: "24px 20px",
                  borderRadius: "20px",
                  boxShadow:
                    "0 8px 32px rgba(187, 162, 160, 0.12), 0 2px 8px rgba(0,0,0,0.08)",
                  border: "1px solid rgba(187, 162, 160, 0.15)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  marginBottom: 4,
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget as HTMLDivElement;
                  target.style.transform = "translateY(-4px)";
                  target.style.boxShadow =
                    "0 12px 48px rgba(187, 162, 160, 0.18), 0 4px 16px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget as HTMLDivElement;
                  target.style.transform = "translateY(0px)";
                  target.style.boxShadow =
                    "0 8px 32px rgba(187, 162, 160, 0.12), 0 2px 8px rgba(0,0,0,0.08)";
                }}
                onTouchStart={(e) => {
                  const target = e.currentTarget as HTMLDivElement;
                  target.style.transform = "scale(0.98) translateY(-2px)";
                }}
                onTouchEnd={(e) => {
                  const target = e.currentTarget as HTMLDivElement;
                  target.style.transform = "scale(1) translateY(0px)";
                }}
              >
                {/* Decoración superior */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: `linear-gradient(90deg, #BBA2A0 0%, rgba(187, 162, 160, 0.7) 50%, #BBA2A0 100%)`,
                    borderRadius: "20px 20px 0 0",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "24px",
                    gap: "12px",
                  }}
                >
                  <div style={{ flex: "1" }}>
                    <h3
                      style={{
                        fontSize: "22px",
                        fontWeight: "800",
                        color: "#1a1a1a",
                        margin: "0 0 4px 0",
                        lineHeight: "1.2",
                        overflow: "hidden",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        background:
                          "linear-gradient(135deg, #BBA2A0 0%, #A08E8D 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {turno.nombre}
                    </h3>
                    <div
                      style={{
                        width: "40px",
                        height: "2px",
                        background:
                          "linear-gradient(90deg, #BBA2A0, rgba(187, 162, 160, 0.3))",
                        borderRadius: "2px",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexShrink: 0,
                      alignItems: "center",
                    }}
                  >
                    <button
                      onClick={() =>
                        navigate("/modificar-turno", { state: { turno } })
                      }
                      style={{
                        height: "38px",
                        width: "38px",
                        background: "rgba(187, 162, 160, 0.15)",
                        color: "#BBA2A0",
                        border: "none",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.18s cubic-bezier(.4,1.3,.6,1)",
                        boxShadow: "0 2px 8px rgba(187, 162, 160, 0.08)",
                        fontSize: "17px",
                        cursor: "pointer",
                        outline: "none",
                      }}
                      onMouseEnter={(e) => {
                        const target = e.target as HTMLButtonElement;
                        target.style.background = "#BBA2A0";
                        target.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        const target = e.target as HTMLButtonElement;
                        target.style.background = "rgba(187, 162, 160, 0.15)";
                        target.style.color = "#BBA2A0";
                      }}
                      aria-label="Editar turno"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                      </svg>
                    </button>

                    {/* Eliminar */}
                    <button
                      onClick={() => handleDelete(turno.id)}
                      disabled={deletingId === turno.id}
                      style={{
                        height: "38px",
                        width: "38px",
                        background:
                          deletingId === turno.id
                            ? "rgba(187, 162, 160, 0.1)"
                            : "rgba(187, 162, 160, 0.15)",
                        color: deletingId === turno.id ? "#A08E8D" : "#BBA2A0",
                        border: "none",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.18s cubic-bezier(.4,1.3,.6,1)",
                        boxShadow: "0 2px 8px rgba(187, 162, 160, 0.08)",
                        fontSize: "17px",
                        cursor:
                          deletingId === turno.id ? "not-allowed" : "pointer",
                        opacity: deletingId === turno.id ? 0.6 : 1,
                        outline: "none",
                      }}
                      onMouseEnter={(e) => {
                        if (deletingId !== turno.id) {
                          const target = e.target as HTMLButtonElement;
                          target.style.background = "#BBA2A0";
                          target.style.color = "#fff";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (deletingId !== turno.id) {
                          const target = e.target as HTMLButtonElement;
                          target.style.background = "rgba(187, 162, 160, 0.15)";
                          target.style.color = "#BBA2A0";
                        }
                      }}
                      aria-label="Eliminar turno"
                    >
                      {deletingId === turno.id ? (
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            border: "2px solid #64748b",
                            borderTop: "2px solid transparent",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                          }}
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Fecha y hora */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      backgroundColor:
                        turno.fecha === getHoy()
                          ? "#ecfdf5"
                          : "rgba(187, 162, 160, 0.08)",
                      padding: "10px 14px",
                      borderRadius: "16px",
                      border:
                        turno.fecha === getHoy()
                          ? "1px solid #a7f3d0"
                          : "1px solid rgba(187, 162, 160, 0.15)",
                      backdropFilter: "blur(10px)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                  >
                    <span style={{ fontSize: "18px" }}>📅</span>
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: "700",
                        color: turno.fecha === getHoy() ? "#065f46" : "#4a4a4a",
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
                            marginLeft: "8px",
                            fontSize: "11px",
                            backgroundColor: "#10b981",
                            color: "white",
                            padding: "3px 8px",
                            borderRadius: "8px",
                            fontWeight: "800",
                            letterSpacing: "0.5px",
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
                      gap: "8px",
                      backgroundColor: "rgba(187, 162, 160, 0.08)",
                      padding: "10px 14px",
                      borderRadius: "16px",
                      border: "1px solid rgba(187, 162, 160, 0.15)",
                      backdropFilter: "blur(10px)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                  >
                    <span style={{ fontSize: "18px" }}>🕐</span>
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: "700",
                        color: "#4a4a4a",
                      }}
                    >
                      {turno.hora}
                    </span>
                  </div>
                </div>

                {/* WhatsApp */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "20px",
                    padding: "12px 16px",
                    backgroundColor: "rgba(37, 211, 102, 0.05)",
                    borderRadius: "16px",
                    border: "1px solid rgba(37, 211, 102, 0.15)",
                  }}
                >
                  <a
                    href={`https://wa.me/${turno.telefono.replace(
                      /[^\d]/g,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 44,
                      height: 44,
                      borderRadius: "14px",
                      background:
                        "linear-gradient(135deg, #25D366 0%, #1da851 100%)",
                      border: "none",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      textDecoration: "none",
                      boxShadow: "0 4px 12px rgba(37, 211, 102, 0.3)",
                    }}
                    aria-label="Contactar por WhatsApp"
                    title="Contactar por WhatsApp"
                    onMouseEnter={(e) => {
                      const target = e.currentTarget as HTMLAnchorElement;
                      target.style.transform = "scale(1.05)";
                      target.style.boxShadow =
                        "0 6px 20px rgba(37, 211, 102, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      const target = e.currentTarget as HTMLAnchorElement;
                      target.style.transform = "scale(1)";
                      target.style.boxShadow =
                        "0 4px 12px rgba(37, 211, 102, 0.3)";
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.22-1.63A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.67-.5-5.24-1.44l-.37-.22-3.69.97.99-3.59-.24-.37A9.94 9.94 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.6c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-.97 2.43.03 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.56-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" />
                    </svg>
                  </a>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#25D366",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: "2px",
                      }}
                    >
                      WhatsApp
                    </div>
                    <span
                      style={{
                        fontSize: "16px",
                        color: "#2d5016",
                        fontWeight: "600",
                        overflow: "hidden",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        display: "block",
                      }}
                    >
                      {turno.telefono}
                    </span>
                  </div>
                </div>

                {/* Servicio solicitado */}
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(187, 162, 160, 0.08) 0%, rgba(187, 162, 160, 0.03) 100%)",
                    padding: "18px 20px",
                    borderRadius: "18px",
                    border: "1px solid rgba(187, 162, 160, 0.15)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "2px",
                      background:
                        "linear-gradient(90deg, #BBA2A0 0%, rgba(187, 162, 160, 0.3) 100%)",
                    }}
                  />
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "#BBA2A0",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      marginBottom: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span style={{ fontSize: "14px" }}>✂️</span>
                    Servicio solicitado
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "800",
                      color: "#2a2a2a",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      maxWidth: "100%",
                      overflow: "hidden",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      lineHeight: "1.3",
                    }}
                  >
                    <span
                      style={{
                        overflow: "hidden",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        display: "block",
                        background:
                          "linear-gradient(135deg, #BBA2A0 0%, #A08E8D 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {turno.servicio}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                  }}
                ></div>
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
        .swal-btn-confirm:hover {
          background: #A08E8D !important;
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
        .swal-warning-icon {
          border-color: #BBA2A0 !important;
          color: #BBA2A0 !important;
        }
        .swal2-icon.swal2-warning {
          border-color: #BBA2A0 !important;
          color: #BBA2A0 !important;
        }
        .swal2-icon.swal2-warning .swal2-icon-content {
          color: #BBA2A0 !important;
        }
      `}</style>
      </div>
    </div>
  );
}
