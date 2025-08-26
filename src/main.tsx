import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // si usás Tailwind o estilos propios

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
