import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { addConsulta } from "../assets/utils/localStorageConsultas";
import { ConsultaCliente } from "../types.consulta";

const initialForm: Omit<ConsultaCliente, "id"> = {
  nombreCompleto: "",
  colorTintura: "",
  notaAdicional: "",
};

export default function AltaConsulta() {
  const [form, setForm] = useState(initialForm);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // setLoading(true);
    addConsulta(form);
    // setLoading(false);
    Swal.fire({
      title: "Consulta registrada!",
      icon: "success",
      timer: 1200,
      showConfirmButton: false,
    });
    navigate("/consultas");
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 16 }}>
      <h2>Nueva Consulta</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="input-principal"
          name="nombreCompleto"
          value={form.nombreCompleto}
          onChange={handleChange}
          placeholder="Nombre y apellido"
          required
        />
        <input
          className="input-principal"
          name="colorTintura"
          value={form.colorTintura}
          onChange={handleChange}
          placeholder="Color de tintura"
        />
        <textarea
          className="input-principal"
          name="notaAdicional"
          value={form.notaAdicional}
          onChange={handleChange}
          placeholder="Nota adicional"
        />
        <button
          type="submit"
          style={{
            background: "#ff6b9d",
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
          Registrar Consulta
        </button>
        <button
          type="button"
          onClick={() => navigate("/consultas")}
          style={{
            background: "#eee",
            color: "#333",
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
      </form>
    </div>
  );
}
