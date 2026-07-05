"use client";

import { useEffect, useState } from "react";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "TMF Fun Hub";
const EVENT_NAME = process.env.NEXT_PUBLIC_EVENT_NAME || "Amigo Invisible TMF";
const EVENT_DATE = process.env.NEXT_PUBLIC_EVENT_DATE || "2026-07-23";
const EVENT_TIME = process.env.NEXT_PUBLIC_EVENT_TIME || "16:45";
const GIFT_BUDGET = process.env.NEXT_PUBLIC_GIFT_BUDGET || "$20000";
const REVEAL_DATETIME = process.env.NEXT_PUBLIC_REVEAL_DATETIME || "2026-07-23T16:45:00-03:00";

const clueCalendar = [
  "Pista 1 - Martes 7/7",
  "Pista 2 - Jueves 9/7",
  "Pista 3 - Martes 14/7",
  "Pista 4 - Jueves 16/7",
  "Pista 5 - Martes 21/7",
  "Pista final - Miércoles 22/7"
];

function daysLeft() {
  const target = new Date(`${EVENT_DATE}T00:00:00-03:00`).getTime();
  const now = Date.now();
  return Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)));
}

function revealEnabled() {
  return Date.now() >= new Date(REVEAL_DATETIME).getTime();
}

export default function Home() {
  const [code, setCode] = useState("");
  const [savedCode, setSavedCode] = useState("");
  const [participant, setParticipant] = useState(null);
  const [clues, setClues] = useState([]);
  const [secretFriendName, setSecretFriendName] = useState("");
  const [clueText, setClueText] = useState("");
  const [selectedClue, setSelectedClue] = useState(clueCalendar[0]);
  const [revealedGift, setRevealedGift] = useState(false);
  const [revealedSecret, setRevealedSecret] = useState(false);
  const [canReveal, setCanReveal] = useState(revealEnabled());
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setCanReveal(revealEnabled()), 30000);
    return () => clearInterval(timer);
  }, []);

  async function loadData(activeCode) {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: activeCode })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo ingresar.");
      setParticipant(data.participant);
      setClues(data.clues || []);
      setSecretFriendName(data.secretFriendName || "");
      setSavedCode(activeCode);
      localStorage.setItem("tmfFriendCode", activeCode);
    } catch (e) {
      setMsg(e.message);
      localStorage.removeItem("tmfFriendCode");
    } finally {
      setLoading(false);
    }
  }

  async function login(e) {
    e.preventDefault();
    const clean = code.trim().toUpperCase();
    if (clean) await loadData(clean);
  }

  async function sendClue(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/clues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: savedCode, text: clueText, type: selectedClue })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo enviar la pista.");
      setClueText("");
      setMsg("Pista enviada correctamente.");
      await loadData(savedCode);
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("tmfFriendCode");
    setParticipant(null);
    setClues([]);
    setSecretFriendName("");
    setSavedCode("");
    setCode("");
    setRevealedGift(false);
    setRevealedSecret(false);
    setMsg("");
  }

  useEffect(() => {
    const existing = localStorage.getItem("tmfFriendCode");
    if (existing) loadData(existing);
  }, []);

  if (!participant) {
    return (
      <main>
        <div className="card small-card">
          <div className="brand">
            <img src="/tmf-logo.png" className="logo" alt="TMF Group" />
            <div>
              <h1>{APP_NAME}</h1>
              <p className="muted">{EVENT_NAME}</p>
            </div>
          </div>
          <form onSubmit={login} className="grid" style={{ marginTop: 24 }}>
            <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Código secreto" />
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
              <h1>{EVENT_NAME}</h1>
              <p className="muted">Hola, {participant.name}. Faltan <b>{daysLeft()}</b> días para el intercambio.</p>
              <span className="badge">23 de julio</span>
              <span className="badge">{EVENT_TIME} hs</span>
              <span className="badge">Presupuesto: {GIFT_BUDGET}</span>
            </div>
          </div>
          <button className="secondary" onClick={logout}>Salir</button>
        </div>

        <div className="grid two" style={{ marginTop: 24 }}>
          <section className="section">
            <h2>🎯 A quién tengo que regalarle</h2>
            {!revealedGift ? (
              <>
                <p className="muted">Tocá para revelar a quién tenés que hacerle el regalo.</p>
                <button onClick={() => setRevealedGift(true)}>Revelar mi amigo</button>
              </>
            ) : (
              <>
                <div className="friend">{participant.assignedToName}</div>
                <p className="muted">Guardá el secreto hasta el intercambio.</p>
              </>
            )}
          </section>

          <section className={canReveal ? "reveal-box" : "section"}>
            <h2>🎉 Quién era mi amigo secreto</h2>
            {!canReveal ? (
              <>
                <p>Esta opción se habilita automáticamente el <b>23 de julio a las {EVENT_TIME} hs</b>.</p>
                <p>Hasta ese momento, las pistas siguen siendo anónimas.</p>
              </>
            ) : !revealedSecret ? (
              <>
                <p>Ya podés descubrir quién te estuvo enviando pistas.</p>
                <button onClick={() => setRevealedSecret(true)}>Revelar amigo secreto</button>
              </>
            ) : (
              <>
                <div className="confetti">🎉🎁🎉</div>
                <p>Tu amigo secreto era:</p>
                <div className="friend" style={{ color: "white" }}>{secretFriendName || "No disponible"}</div>
              </>
            )}
          </section>
        </div>

        <div className="grid two" style={{ marginTop: 18 }}>
          <section className="section">
            <h2>✉️ Enviar pista</h2>
            <p className="muted">Tu amigo verá la pista, pero no sabrá que fuiste vos hasta la revelación.</p>
            <form className="grid" onSubmit={sendClue}>
              <select value={selectedClue} onChange={(e) => setSelectedClue(e.target.value)}>
                {clueCalendar.map((item) => <option key={item}>{item}</option>)}
              </select>
              <textarea value={clueText} onChange={(e) => setClueText(e.target.value)} placeholder="Escribí una pista divertida..." maxLength={300} />
              <button disabled={loading}>{loading ? "Enviando..." : "Enviar pista"}</button>
            </form>
          </section>

          <section className="section">
            <h2>🕵️ Pistas que recibí</h2>
            {clues.length === 0 ? (
              <p className="muted">Todavía no recibiste pistas.</p>
            ) : (
              clues.map((clue) => (
                <div className="clue" key={clue.id}>
                  <strong>{clue.type || "Pista"}</strong>
                  <p>{clue.text}</p>
                  {canReveal && clue.fromName && <p className="success">La envió: {clue.fromName}</p>}
                </div>
              ))
            )}
          </section>
        </div>

        <section className="section" style={{ marginTop: 18 }}>
          <h2>📅 Calendario de pistas</h2>
          {clueCalendar.map((item) => <span className="badge" key={item}>{item}</span>)}
        </section>

        {msg && <p className={msg.includes("correctamente") ? "success" : "error"}>{msg}</p>}
      </div>
    </main>
  );
}
