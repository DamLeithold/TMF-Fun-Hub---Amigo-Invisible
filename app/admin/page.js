"use client";

import { useState } from "react";

function csvEscape(value) {
  const s = String(value ?? "");
  return `"${s.replaceAll('"', '""')}"`;
}

export default function Admin() {
  const [adminCode, setAdminCode] = useState("");
  const [data, setData] = useState(null);
  const [names, setNames] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function load(showLoading = true) {
    if (showLoading) setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminCode })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "No autorizado.");
      setData(json);
      setNames((json.participants || []).map(p => p.name).join("\n"));
    } catch (e) {
      setMsg(e.message);
    } finally {
      if (showLoading) setLoading(false);
    }
  }

  async function api(action, body = {}) {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(`/api/admin/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminCode, ...body })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error.");
      setData(json);
      setNames((json.participants || []).map(p => p.name).join("\n"));
      if (json.message) setMsg(json.message);
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveParticipants(e) {
    e.preventDefault();
    const list = names.split("\n").map(x => x.trim()).filter(Boolean);
    await api("participants", { names: list });
  }

  async function draw() {
    if (!confirm("¿Realizar sorteo? Se asignarán amigos y se borrarán pistas previas.")) return;
    await api("draw");
  }

  async function resetAll() {
    if (!confirm("¿Borrar participantes, sorteo y pistas?")) return;
    await api("reset");
  }

  function exportCSV() {
    if (!data?.participants?.length) return;
    const rows = [
      ["Nombre", "Código", "Le tocó regalarle a", "Su amigo secreto es", "Mensaje"],
      ...data.participants.map(p => [
        p.name,
        p.code,
        p.assignedToName || "Pendiente",
        p.secretFriendName || "Pendiente",
        `Hola ${p.name}! 🎁 Ya podés entrar al Amigo Invisible TMF. Tu código secreto es: ${p.code}`
      ])
    ];
    const csv = rows.map(r => r.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "codigos-amigo-invisible-tmf.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!data) {
    return (
      <main>
        <div className="card small-card">
          <div className="brand">
            <img src="/tmf-logo.png" className="logo" alt="TMF Group" />
            <div>
              <h1>Panel administrador</h1>
              <p className="muted">Ingresá el código de administrador.</p>
            </div>
          </div>
          <form className="grid" style={{ marginTop: 24 }} onSubmit={(e) => { e.preventDefault(); load(); }}>
            <input value={adminCode} onChange={(e) => setAdminCode(e.target.value)} placeholder="Código administrador" />
            <button disabled={loading}>{loading ? "Ingresando..." : "Ingresar"}</button>
          </form>
          {msg && <p className="error">{msg}</p>}
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="card">
        <div className="header">
          <div className="brand">
            <img src="/tmf-logo.png" className="logo" alt="TMF Group" />
            <div>
              <h1>Panel administrador</h1>
              <p className="muted">Gestión del Amigo Invisible TMF. Cargá participantes, realizá el sorteo y controlá las pistas.</p>
              <span className="badge">Revelación: 23/7 - 16:45 hs</span>
            </div>
          </div>
          <div className="actions">
            <button className="secondary" onClick={() => load()}>Actualizar</button>
            <button className="secondary" onClick={exportCSV}>Exportar códigos</button>
            <button className="danger" onClick={resetAll}>Reiniciar todo</button>
          </div>
        </div>

        <div className="grid three" style={{ marginTop: 24 }}>
          <section className="section">
            <h2>👥 Participantes</h2>
            <p className="count">{data.participants.length}</p>
          </section>
          <section className="section">
            <h2>🎲 Sorteo</h2>
            <p className={data.drawComplete ? "success" : "warning"}>
              {data.drawComplete ? "Sorteo realizado" : "Sorteo pendiente"}
            </p>
            <button onClick={draw} disabled={loading || data.participants.length < 3}>Realizar sorteo</button>
          </section>
          <section className="section">
            <h2>✉️ Pistas</h2>
            <p className="count">{data.clues.length}</p>
          </section>
        </div>

        <div className="grid three" style={{ marginTop: 18 }}>
          <section className="section">
            <h2>Cargar participantes</h2>
            <p className="muted">Un nombre por línea. Al guardar, se reinician participantes, sorteo y pistas.</p>
            <form className="grid" onSubmit={saveParticipants}>
              <textarea value={names} onChange={(e) => setNames(e.target.value)} placeholder={"Damian\nFlor\nEliana"} />
              <button disabled={loading}>Guardar participantes</button>
            </form>
          </section>

          <section className="section">
            <h2>Texto sugerido</h2>
            <div className="copybox">Hola! 🎁 Ya podés entrar al Amigo Invisible TMF. Tu código secreto es: XXXXXX</div>
            <p className="muted">El amigo secreto se revelará automáticamente el 23 de julio a las 16:45 hs.</p>
          </section>
        </div>

        <section className="section" style={{ marginTop: 18 }}>
          <h2>Tabla de participantes</h2>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Código</th>
                  <th>Le tocó regalarle a</th>
                  <th>Su amigo secreto es</th>
                  <th>Enviadas</th>
                  <th>Recibidas</th>
                </tr>
              </thead>
              <tbody>
                {data.participants.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td className="code">{p.code}</td>
                    <td>{p.assignedToName || "Pendiente"}</td>
                    <td>{p.secretFriendName || "Pendiente"}</td>
                    <td>{p.sentCount}</td>
                    <td>{p.receivedCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="section" style={{ marginTop: 18 }}>
          <h2>Todas las pistas</h2>
          {data.clues.length === 0 ? <p className="muted">Todavía no hay pistas.</p> : data.clues.map(c => (
            <div className="clue" key={c.id}>
              <strong>{c.type}</strong>
              <p><b>De:</b> {c.fromName} → <b>Para:</b> {c.toName}</p>
              <p>{c.text}</p>
            </div>
          ))}
        </section>

        {msg && <p className={msg.includes("correctamente") || msg.includes("realizado") ? "success" : "error"}>{msg}</p>}
      </div>
    </main>
  );
}
