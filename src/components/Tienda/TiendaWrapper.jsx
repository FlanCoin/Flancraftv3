// src/components/Tienda/TiendaWrapper.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import TiendaCategorias from "./TiendaCategorias";
import TiendaCategoriaDetalle from "./TiendaCategoriaDetalle";

const TiendaWrapper = () => {
  return (
    <Routes>
      <Route path="/" element={<TiendaCategorias />} />
      <Route path=":modo" element={<TiendaCategoriaDetalle />} />
    </Routes>
  );
};

export default TiendaWrapper;
