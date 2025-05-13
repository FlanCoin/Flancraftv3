import React from 'react';
import { Navigate } from 'react-router-dom';

const allowedUIDs = [
  "Paxino",
  "Crystalchemist",
  "JanitoVP"
];

export default function AdminRoute({ children }) {
  const uid = localStorage.getItem("flan_uid");

  if (!uid || !allowedUIDs.includes(uid)) {
    return <Navigate to="/" />;
  }

  return children;
}
