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
  if (now <= start) return 5;
  if (now >= end) return 100;
  return Math.max(5, Math.min(100, Math.round(((now - start) / (end - start)) * 100)));
}

function revealReady() {
  return Date.now() >= new Date(REVEAL_DATETIME).getTime();
}

export default function Home() {
  const remaining = daysLeft();
  const progress = progressPercent();
  const ready = revealReady();

  return (
    <main className="app-main">
      <div className="app-shell">
        <aside className="sidebar">
          <div className="side-brand">
            <img src="/tmf-logo.png" className="side-logo" alt="TMF Group" />
            <div>
              <strong>{APP_NAME}</strong>
              <span>Powered by Engagement Team</span>
            </div>
          </div>

          <nav className="side-nav">
            <a className="nav-item active">🏠 Inicio</a>
            <Link href="/amigo" className="nav-item">🎁 Amigo Invisible</Link>
            <a className="nav-item disabled">🕵️ El Infiltrado</a>
            <a className="nav-item disabled">🎯 Trivia</a>
            <a className="nav-item disabled">🎲 Bingo Humano</a>
            <a className="nav-item disabled">🏆 Ranking</a>
          </nav>

          <Link href="/admin" className="admin-entry">⚙️ Panel admin</Link>
        </aside>

        <section className="main-panel">
          <header className="topbar">
            <div>
              <span className="eyebrow">Plataforma interna</span>
              <h1>{APP_NAME}</h1>
            </div>
            <span className="powered-mobile">Powered by Engagement Team</span>
          </header>

          <section className="event-spotlight">
            <div className="gift-orb">🎁</div>
            <div className="event-content">
              <span className="event-label">Evento activo</span>
              <h2>{ready ? "¡Llegó el momento!" : EVENT_NAME}</h2>
              <p>
                {ready
                  ? "La revelación ya está habilitada. Entrá con tu código y descubrí quién era tu amigo secreto."
                  : `Revelación programada para el 23 de julio a las ${EVENT_TIME} hs.`}
              </p>

              <div className="event-meta">
                <span>📅 23 Julio</span>
                <span>🕓 {EVENT_TIME} hs</span>
                <span>⏳ {remaining} días</span>
              </div>

              <div className="big-progress">
                <div className="big-progress-info">
                  <span>Progreso del evento</span>
                  <b>{progress}%</b>
                </div>
                <div className="big-progress-track">
                  <div className="big-progress-bar" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="hero-actions">
                <Link href="/amigo" className="primary-cta">
                  {ready ? "🎉 Revelar ahora" : "Ingresar con mi código"}
                </Link>
                <Link href="/admin" className="secondary-cta">Administrar evento</Link>
              </div>
            </div>
          </section>

          <section className="quick-grid">
            <div className="quick-card">
              <span>👥</span>
              <strong>Participantes</strong>
              <p>Carga desde el panel admin.</p>
            </div>
            <div className="quick-card">
              <span>🎲</span>
              <strong>Sorteo automático</strong>
              <p>Evita autoasignaciones.</p>
            </div>
            <div className="quick-card">
              <span>✉️</span>
              <strong>Buzón digital</strong>
              <p>Pistas anónimas hasta la revelación.</p>
            </div>
            <div className="quick-card">
              <span>🎉</span>
              <strong>Revelación</strong>
              <p>23/07 a las {EVENT_TIME} hs.</p>
            </div>
          </section>

          <section className="modules-row">
            <div className="section-title">
              <h2>Próximos módulos</h2>
              <p>La base queda lista para sumar nuevas actividades.</p>
            </div>
            <div className="mini-modules">
              <div>🕵️ El Infiltrado</div>
              <div>🎯 Trivia TMF</div>
              <div>🎲 Bingo Humano</div>
              <div>🎡 Ruleta</div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
