// 📁 src/components/RewardList.jsx
import { useEffect, useState } from "react";

export default function RewardList({ user }) {
  const [reclamadas, setReclamadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const recompensas = [
    { nivel: 1, descripcion: "100 ECOS" },
    { nivel: 5, descripcion: "200 ECOS" },
    { nivel: 10, descripcion: "300 ECOS" },
    // Puedes añadir más niveles aquí
  ];

  useEffect(() => {
    fetch(`https://flancraftweb-backend.onrender.com/api/recompensas/reclamadas/${user.uuid}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setReclamadas(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user.uuid]);

  const handleReclamar = async (nivel) => {
    try {
      const res = await fetch("https://flancraftweb-backend.onrender.com/api/recompensas/reclamar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uuid: user.uuid, nivel })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReclamadas([...reclamadas, nivel]);
      alert("¡Recompensa reclamada!");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (loading) return <p>Cargando recompensas...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="reward-list">
      <h2>🎁 Recompensas de Nivel</h2>
      <ul>
        {recompensas.map((r) => {
          const yaReclamada = reclamadas.includes(r.nivel);
          const alcanzado = user.nivel >= r.nivel;

          return (
            <li key={r.nivel} className="reward-item">
              <span>Nivel {r.nivel}: {r.descripcion}</span>
              {yaReclamada ? (
                <span className="claimed">✅ Reclamada</span>
              ) : alcanzado ? (
                <button onClick={() => handleReclamar(r.nivel)}>Reclamar</button>
              ) : (
                <span className="locked">🔒 Bloqueada</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
