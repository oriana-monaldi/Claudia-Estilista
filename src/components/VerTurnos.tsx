"use client";

import { useEffect, useState } from "react";
import type { Turno } from "../types";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getTurnos, deleteTurno } from "../assets/utils/localStorageTurnos";
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
      }}
    >
      <div
        style={{
          padding: "10px 0 0 0",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          maxWidth: "480px",
          margin: "0 auto",
          background: "#fff",
          minHeight: "100vh",
          borderRadius: "0 0 24px 24px",
        }}
      >
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 800,
            color: "#222",
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
          {turnosOrdenados.length} TURNOS
        </p>
        <div
          style={{
            background: "#f8fafc",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            padding: "4px 6px 6px 6px",
            marginBottom: "18px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            border: "1.5px solid #e2e8f0",
          }}
        >
          <h5 style={{ color: "#222", margin: 0 }}>Filtrar por:</h5>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button
              onClick={() => setFiltroFecha("hoy")}
              style={{
                padding: "8px 12px",
                backgroundColor: filtroFecha === "hoy" ? "#222" : "#fff",
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
              HOY
            </button>
            <button
              onClick={() => setFiltroFecha("todos")}
              style={{
                padding: "8px 12px",
                backgroundColor: filtroFecha === "todos" ? "#222" : "#fff",
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
              TODOS
            </button>
          </div>

          <input
            type="text"
            placeholder="Buscar por nombre o apellido"
            value={busquedaNombre}
            onChange={(e) => setBusquedaNombre(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              border: "1.5px solid #e2e8f0",
              borderRadius: "10px",
              fontSize: "15px",
              fontFamily: "inherit",
              backgroundColor: "#fff",
              color: "#222",
              outline: "none",
              boxSizing: "border-box",
              marginBottom: "2px",
            }}
          />
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
                backgroundColor: "#ff6b9d",
                color: "white",
                border: "2px solid #ff6b9d",
                borderRadius: "30px",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(255, 107, 157, 0.2)",
                transition: "all 0.2s ease",
                outline: "none",
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.backgroundColor = "#e55a87";
                target.style.transform = "translateY(-3px)";
                target.style.boxShadow = "0 8px 25px rgba(255, 107, 157, 0.3)";
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.backgroundColor = "#ff6b9d";
                target.style.transform = "translateY(0)";
                target.style.boxShadow = "0 6px 20px rgba(255, 107, 157, 0.2)";
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
                  backgroundColor: "#fff",
                  padding: "14px 8px",
                  borderRadius: "20px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  border: "2px solid #e2e8f0",
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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "20px",
                    gap: "12px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#222",
                      margin: "0",
                      lineHeight: "1.3",
                      flex: "1",
                      overflow: "hidden",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    {turno.nombre}
                  </h3>

                  {/* Botones de acción */}
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexShrink: 0,
                    }}
                  >
                    {/* Editar */}
                    <button
                      onClick={() =>
                        navigate("/modificar-turno", { state: { turno } })
                      }
                      style={{
                        height: "36px",
                        width: "36px",
                        background: "#f1f5f9",
                        color: "#2563eb",
                        border: "1.5px solid #cbd5e1",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                        boxShadow: "none",
                        fontSize: "16px",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        const target = e.target as HTMLButtonElement;
                        target.style.background = "#e0e7ef";
                        target.style.color = "#1d4ed8";
                      }}
                      onMouseLeave={(e) => {
                        const target = e.target as HTMLButtonElement;
                        target.style.background = "#f1f5f9";
                        target.style.color = "#2563eb";
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
                        height: "36px",
                        width: "36px",
                        background: "#f1f5f9",
                        color: "#ef4444",
                        border: "1.5px solid #cbd5e1",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                        boxShadow: "none",
                        fontSize: "16px",
                        cursor:
                          deletingId === turno.id ? "not-allowed" : "pointer",
                        opacity: deletingId === turno.id ? 0.6 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (deletingId !== turno.id) {
                          const target = e.target as HTMLButtonElement;
                          target.style.background = "#fef2f2";
                          target.style.color = "#b91c1c";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (deletingId !== turno.id) {
                          const target = e.target as HTMLButtonElement;
                          target.style.background = "#f1f5f9";
                          target.style.color = "#ef4444";
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
                    gap: "16px",
                    marginBottom: "16px",
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

                {/* WhatsApp */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "16px",
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
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "#e0f7ec",
                      border: "1.5px solid #25D366",
                      transition: "background 0.2s",
                      textDecoration: "none",
                    }}
                    aria-label="Contactar por WhatsApp"
                    title="Contactar por WhatsApp"
                    onMouseEnter={(e) => {
                      const target = e.currentTarget as HTMLAnchorElement;
                      target.style.background = "#25D36622";
                    }}
                    onMouseLeave={(e) => {
                      const target = e.currentTarget as HTMLAnchorElement;
                      target.style.background = "#e0f7ec";
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.22-1.63A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.67-.5-5.24-1.44l-.37-.22-3.69.97.99-3.59-.24-.37A9.94 9.94 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.6c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-.97 2.43.03 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.56-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"
                        fill="#25D366"
                      />
                    </svg>
                  </a>
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

                {/* Servicio solicitado */}
                <div
                  style={{
                    backgroundColor: "#f8fafc",
                    padding: "16px",
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
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
                      color: "#222",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      maxWidth: "100%",
                      overflow: "hidden",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    <span></span>
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
    </div>
  );
}
