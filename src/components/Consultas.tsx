import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import {
  getConsultas,
  addConsulta,
  updateConsulta,
  deleteConsulta,
} from "../assets/utils/localStorageConsultas";
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
    setLoading(true);
    const data = getConsultas();
    setConsultas(data);
    setLoading(false);
  }, []);

  const consultasFiltradas = consultas.filter((c) =>
    c.nombreCompleto.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (editId) {
      updateConsulta(editId, form);
    } else {
      addConsulta(form);
    }
    setConsultas(getConsultas());
    setShowForm(false);
    setEditId(null);
    setForm(initialForm);
    setLoading(false);
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
      deleteConsulta(id);
      setConsultas(getConsultas());
      await swalWithCustomButtons.fire({
        title: "¡Eliminado!",
        text: "La consulta ha sido eliminada.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto",
        padding: 16,
        position: "relative",
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
                    background: "#fff",
                    borderRadius: 12,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                    padding: 16,
                    position: "relative",
                  }}
                >
                  <div
                    style={{ fontWeight: 700, fontSize: 18, color: "#3b82f6" }}
                  >
                    {c.nombreCompleto}
                  </div>
                  <div style={{ fontSize: 15, color: "#333" }}>
                    <b>Color de tintura:</b>{" "}
                    {c.colorTintura || (
                      <span style={{ color: "#bbb" }}>Sin especificar</span>
                    )}
                  </div>
                  {c.notaAdicional && (
                    <div style={{ fontSize: 14, color: "#666" }}>
                      <b>Nota:</b> {c.notaAdicional}
                    </div>
                  )}
                  <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                    <button
                      onClick={() => handleEdit(c)}
                      style={{
                        background: "#3b82f6",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 16px",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      style={{
                        background: "#c00",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 16px",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Eliminar
                    </button>
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
