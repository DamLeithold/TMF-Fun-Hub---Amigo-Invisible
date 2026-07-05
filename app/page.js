import Link from "next/link";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "TMF Fun Hub";
const EVENT_NAME = process.env.NEXT_PUBLIC_EVENT_NAME || "Amigo Invisible TMF";
const EVENT_DATE = process.env.NEXT_PUBLIC_EVENT_DATE || "2026-07-23";
const EVENT_TIME = process.env.NEXT_PUBLIC_EVENT_TIME || "16:45";
const REVEAL_DATETIME = process.env.NEXT_PUBLIC_REVEAL_DATETIME || "2026-07-23T16:45:00-03:00";

function daysLeft() {
  const target = new Date(`${EVENT_DATE}T00:00:00-03:00`).getTime();
  return Math.max(0, Math.ceil((target - Date.now()) / (1000 * 60 * 60 * 24)));
}

function progressPercent() {
  const start = new Date("2026-07-05T00:00:00-03:00").getTime();
  const end = new Date(REVEAL_DATETIME).getTime();
  const now = Date.now();
  if (now <= start) return 3;
  if (now >= end) return 100;
  return Math.max(3, Math.min(100, Math.round(((now - start) / (end - start)) * 100)));
}

function revealReady() {
  return Date.now() >= new Date(REVEAL_DATETIME).getTime();
}

export default function Home() {
  const remaining = daysLeft();
  const progress = progressPercent();
  const ready = revealReady();

  return (
    <main>
      <div className="shell">
        <section className="hero hero-pro">
          <div className="header">
            <div className="brand">
              <img src="/tmf-logo.png" className="logo" alt="TMF Group" />
              <div>
                <h1>{APP_NAME}</h1>
                <p className="muted">Juegos y actividades internas para el equipo.</p>
                <span className="badge">Powered by TMF Team Activities</span>
              </div>
            </div>
            <div className="actions">
              <Link href="/amigo" className="button-link">Entrar al Amigo Invisible</Link>
              <Link href="/admin" className="button-link secondary">Panel admin</Link>
            </div>
          </div>

          <div className={ready ? "event-banner ready" : "event-banner"} style={{ marginTop: 24 }}>
            <div>
              <span className="eyebrow">Evento activo</span>
              <h2>{ready ? "🎉 ¡Ya podés revelar tu amigo secreto!" : "🎁 Amigo Invisible TMF"}</h2>
              <p>{ready ? "La revelación ya está habilitada para todos los participantes." : `Revelación programada para el 23 de julio a las ${EVENT_TIME} hs.`}</p>
            </div>
            <Link href="/amigo" className="button-link">{ready ? "Revelar ahora" : "Ingresar con mi código"}</Link>
          </div>

          <div className="progress-wrap" style={{ marginTop: 20 }}>
            <div className="progress-top">
              <span>Progreso hacia la revelación</span>
              <b>{progress}%</b>
            </div>
            <div className="progress-track">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </section>

        <div className="grid three" style={{ marginTop: 18 }}>
          <section className="section stat-card">
            <span className="stat-icon">⏳</span>
            <h2>Cuenta regresiva</h2>
            <p className="count">{remaining}</p>
            <p className="muted">días para el intercambio.</p>
          </section>
          <section className="section stat-card">
            <span className="stat-icon">🎁</span>
            <h2>Evento activo</h2>
            <p><b>{EVENT_NAME}</b></p>
            <span className="badge">23/7</span>
            <span className="badge">{EVENT_TIME} hs</span>
          </section>
          <section className="section stat-card">
            <span className="stat-icon">📱</span>
            <h2>Desde el celular</h2>
            <p className="muted">Cada persona entra con su código secreto, envía pistas y ve las que recibe.</p>
          </section>
        </div>

        <section className="card" style={{ marginTop: 18 }}>
          <div className="header">
            <div>
              <h2>Módulos disponibles</h2>
              <p className="muted">La idea es que TMF Fun Hub crezca con nuevas actividades internas.</p>
            </div>
          </div>

          <div className="grid three" style={{ marginTop: 12 }}>
            <Link href="/amigo" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="module active-module">
                <div className="module-icon">🎁</div>
                <h3>Amigo Invisible</h3>
                <p className="muted">Sorteo, códigos secretos, pistas y revelación automática.</p>
                <span className="badge">Activo</span>
              </div>
            </Link>

            {[
              ["🧍", "Bingo Humano", "Cartones y consignas para integración."],
              ["🕵️", "El Infiltrado", "Juego de roles ocultos para afters."],
              ["🔎", "Búsqueda del Tesoro", "Misiones, pistas y desafíos por equipos."],
              ["❓", "Trivia TMF", "Preguntas, ranking y competencia amistosa."],
              ["🎡", "Ruleta de Premios", "Sorteos rápidos para eventos."]
            ].map(([icon, title, desc]) => (
              <div className="module locked-module" key={title}>
                <div className="module-icon">{icon}</div>
                <h3>{title}</h3>
                <p className="muted">{desc}</p>
                <span className="badge">Próximamente</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
