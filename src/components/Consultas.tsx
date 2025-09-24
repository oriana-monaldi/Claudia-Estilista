import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import {
  getConsultas,
  addConsulta,
  updateConsulta,
  deleteConsulta,
} from "../assets/utils/firestoreConsultas";
import { ConsultaCliente } from "../types.consulta";
import { HeaderBar } from "./HeaderBar";

const initialForm: Omit<ConsultaCliente, "id"> = {
  nombreCompleto: "",
  colorTintura: "",
  notaAdicional: "",
};

export default function Consultas() {
  const [consultas, setConsultas] = useState<ConsultaCliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [filtro, setFiltro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadConsultas = async () => {
      setLoading(true);
      try {
        const data = await getConsultas();
        setConsultas(data);
      } catch (error) {
        console.error("Error cargando consultas:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar las consultas",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setLoading(false);
      }
    };
    loadConsultas();
  }, []);

  const consultasFiltradas = consultas.filter((c) =>
    c.nombreCompleto.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await updateConsulta(editId, form);
      } else {
        await addConsulta(form);
      }
      const data = await getConsultas();
      setConsultas(data);
      setShowForm(false);
      setEditId(null);
      setForm(initialForm);
      Swal.fire({
        title: editId ? "Consulta actualizada!" : "Consulta registrada!",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al guardar consulta:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar la consulta. Intenta nuevamente.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (c: ConsultaCliente) => {
    navigate(`/editar-consulta/${c.id}`);
  };

  const handleDelete = async (id: string) => {
    const swalWithCustomButtons = Swal.mixin({
      customClass: {
        confirmButton: "swal-btn-confirm",
        cancelButton: "swal-btn-cancel",
      },
      buttonsStyling: false,
    });

    const result = await swalWithCustomButtons.fire({
      title: "¿Está seguro que desea eliminar la nota?",
      text: "¡No podrás revertir esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteConsulta(id);
        const data = await getConsultas();
        setConsultas(data);
        await swalWithCustomButtons.fire({
          title: "¡Eliminado!",
          text: "La consulta ha sido eliminada.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        console.error("Error eliminando consulta:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar la consulta. Intenta nuevamente.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto",
        padding: 16,
        position: "relative",
        height: "100vh",
        overflowY: "auto",
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
        <span style={{ fontSize: 16 }}>Consultas</span>
      </HeaderBar>
      <div style={{ margin: "16px 0" }}>
        <input
          className="input-principal"
          placeholder="Filtrar por nombre o apellido"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{ width: "100%", marginBottom: 16 }}
        />
        {loading ? (
          <div>Cargando...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {consultasFiltradas.map((c) => {
              return (
                <div
                  key={c.id}
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
                      marginBottom: "20px",
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
                        {c.nombreCompleto}
                      </h3>
                      <div
                        style={{
                          width: "40px",
                          height: "2px",
                          background:
                            "linear-gradient(90deg, #BBA2A0, rgba(187, 162, 160, 0.3))",
                          borderRadius: "1px",
                          marginBottom: "12px",
                        }}
                      />
                    </div>

                    {/* Botones de acción */}
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "flex-start",
                        marginTop: "2px",
                      }}
                    >
                      {/* Editar */}
                      <button
                        onClick={() => handleEdit(c)}
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
                        aria-label="Editar consulta"
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
                        onClick={() => handleDelete(c.id)}
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
                        aria-label="Eliminar consulta"
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
                          <polyline points="3,6 5,6 21,6" />
                          <path d="m19,6v14a2,2 0 0 1 -2,2H7a2,2 0 0 1 -2,-2V6m3,0V4a2,2 0 0 1 2,-2h4a2,2 0 0 1 2,2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <div
                      style={{
                        marginBottom: "12px",
                        padding: "12px 16px",
                        backgroundColor: "rgba(187, 162, 160, 0.08)",
                        borderRadius: "12px",
                        border: "1px solid rgba(187, 162, 160, 0.15)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#666",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "6px",
                        }}
                      >
                        Color de tintura:
                      </div>
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: "500",
                          color: c.colorTintura ? "#2d3748" : "#a0aec0",
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                          hyphens: "auto",
                          lineHeight: "1.4",
                        }}
                      >
                        {c.colorTintura || "Sin especificar"}
                      </div>
                    </div>

                    {c.notaAdicional && (
                      <div
                        style={{
                          padding: "12px 16px",
                          backgroundColor: "rgba(187, 162, 160, 0.05)",
                          borderRadius: "12px",
                          border: "1px solid rgba(187, 162, 160, 0.1)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#666",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            marginBottom: "6px",
                          }}
                        >
                          Nota adicional:
                        </div>
                        <div
                          style={{
                            fontSize: "15px",
                            color: "#4a5568",
                            lineHeight: "1.5",
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                            hyphens: "auto",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {c.notaAdicional}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            margin: "32px 0 0 0",
            background: "#f7f7f7",
            borderRadius: 12,
            padding: 24,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <input
              className="input-principal"
              name="nombre"
              placeholder="Nombre"
              value={form.nombreCompleto}
              onChange={handleChange}
              required
              style={{ flex: 1 }}
            />
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <input
              className="input-principal"
              name="colorTintura"
              placeholder="Color de tintura"
              value={form.colorTintura}
              onChange={handleChange}
              style={{ flex: 1 }}
            />
          </div>
          <textarea
            className="input-principal"
            name="notaAdicional"
            placeholder="Nota adicional"
            value={form.notaAdicional}
            onChange={handleChange}
            style={{
              width: "100%",
              minHeight: 60,
              marginBottom: 12,
              background: "#fff",
            }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: "#3b82f6",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "12px 24px",
                fontWeight: 700,
                fontSize: 16,
                cursor: loading ? "not-allowed" : "pointer",
                width: "100%",
                marginTop: 8,
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              {editId ? "Actualizar" : "Agregar"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditId(null);
                setForm(initialForm);
              }}
              style={{
                background: "#bbb",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "12px 24px",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
                width: "100%",
                marginTop: 8,
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
      <button
        onClick={() => navigate("/alta-consulta")}
        onMouseEnter={(e) => {
          const target = e.target as HTMLButtonElement;
          target.style.background = "#A08E8D";
          target.style.transform = "scale(1.1)";
          target.style.boxShadow = "0 4px 16px rgba(187, 162, 160, 0.4)";
        }}
        onMouseLeave={(e) => {
          const target = e.target as HTMLButtonElement;
          target.style.background = "#BBA2A0";
          target.style.transform = "scale(1)";
          target.style.boxShadow = "0 2px 8px rgba(187, 162, 160, 0.3)";
        }}
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#BBA2A0",
          color: "#fff",
          fontSize: 36,
          border: "none",
          boxShadow: "0 2px 8px rgba(187, 162, 160, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        aria-label="Agregar clienta"
      >
        +
      </button>
    </div>
  );
}
