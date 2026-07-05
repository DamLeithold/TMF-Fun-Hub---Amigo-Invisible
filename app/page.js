import Link from "next/link";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "TMF Fun Hub";
const EVENT_NAME = process.env.NEXT_PUBLIC_EVENT_NAME || "Amigo Invisible TMF";
const EVENT_DATE = process.env.NEXT_PUBLIC_EVENT_DATE || "2026-07-23";
const EVENT_TIME = process.env.NEXT_PUBLIC_EVENT_TIME || "16:45";

function daysLeft() {
  const target = new Date(`${EVENT_DATE}T00:00:00-03:00`).getTime();
  return Math.max(0, Math.ceil((target - Date.now()) / (1000 * 60 * 60 * 24)));
}

export default function Home() {
  return (
    <main>
      <div className="shell">
        <section className="hero">
          <div className="header">
            <div className="brand">
              <img src="/tmf-logo.png" className="logo" alt="TMF Group" />
              <div>
                <h1>{APP_NAME}</h1>
                <p className="muted">Juegos y actividades internas para el equipo.</p>
                <span className="badge">Powered by TMF Team Activities</span>
              </div>
            </div>
            <Link href="/admin" className="button-link secondary">Panel admin</Link>
          </div>
        </section>

        <div className="grid three" style={{ marginTop: 18 }}>
          <section className="section">
            <h2>⏳ Cuenta regresiva</h2>
            <p className="count">{daysLeft()}</p>
            <p className="muted">días para el intercambio.</p>
          </section>
          <section className="section">
            <h2>🎁 Evento activo</h2>
            <p><b>{EVENT_NAME}</b></p>
            <span className="badge">23/7</span>
            <span className="badge">{EVENT_TIME} hs</span>
          </section>
          <section className="section">
            <h2>📱 Desde el celular</h2>
            <p className="muted">Cada persona entra con su código secreto y gestiona sus pistas.</p>
          </section>
        </div>

        <section className="card" style={{ marginTop: 18 }}>
          <h2>Módulos disponibles</h2>
          <div className="grid three">
            <Link href="/amigo" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="module">
                <div className="module-icon">🎁</div>
                <h3>Amigo Invisible</h3>
                <p className="muted">Sorteo, códigos secretos, pistas y revelación automática.</p>
                <span className="badge">Activo</span>
              </div>
            </Link>
            {["🧍 Bingo Humano", "🕵️ El Infiltrado", "🔎 Búsqueda del Tesoro", "❓ Trivia TMF", "🎡 Ruleta de Premios"].map((item) => (
              <div className="module" key={item}>
                <div className="module-icon">{item.split(" ")[0]}</div>
                <h3>{item.substring(2)}</h3>
                <p className="muted">Módulo preparado para sumar en futuras actividades.</p>
                <span className="badge">Próximamente</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
