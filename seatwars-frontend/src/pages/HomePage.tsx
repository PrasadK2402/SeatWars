import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bus } from "lucide-react";
import { SearchForm } from "../components/booking/SearchForm";
import { getRoutes } from "../api/routes";
import { tomorrowISO, titleCase } from "../utils/format";

const STEPS = [
  {
    n: "01",
    title: "SCAN",
    desc: "Enter origin, destination and date. The console scans every scheduled trip on that route in milliseconds.",
  },
  {
    n: "02",
    title: "SELECT",
    desc: "Open the seat schematic and pick your exact unit — window, aisle, front or back. What you see is what's free.",
  },
  {
    n: "03",
    title: "BOARD",
    desc: "Confirm and your boarding pass is issued instantly. Show the reference at the gate. Cancel free, anytime.",
  },
];

export function HomePage() {
  const [routes, setRoutes] = useState<{ source: string; destination: string }[]>([]);

  useEffect(() => {
    getRoutes().then((r) => setRoutes(r.slice(0, 8))).catch(() => {});
  }, []);

  const cities = useMemo(() => {
    const s = new Set<string>();
    routes.forEach((r) => {
      s.add(r.source);
      s.add(r.destination);
    });
    return s.size;
  }, [routes]);

  const marqueeRoutes = useMemo(() => {
    const base = routes.length > 0 ? routes : [
      { source: "Bengaluru", destination: "Hyderabad" },
      { source: "Mumbai", destination: "Pune" },
      { source: "Delhi", destination: "Jaipur" },
      { source: "Chennai", destination: "Coimbatore" },
    ];
    return [...base, ...base];
  }, [routes]);

  return (
    <>
      <section className="hero">
        <div className="starfield" />
        <div className="hero-glow" />
        <div className="container hero-inner">
          <span className="hero-badge">
            <span className="status-dot" /> SYSTEM ONLINE // {cities > 0 ? `${cities} CITIES` : "ALL ROUTES"}
          </span>
          <h1 className="hero-title">
            GO<br />SOMEWHERE<span className="red">.</span>
          </h1>
          <p className="hero-sub">
            SeatWars is mission control for bus travel — scan live trips,
            pick your exact seat on the schematic, and board with a
            reference. Nothing to decode.
          </p>
        </div>

        <div className="hero-console-wrap">
          <div className="hero-console">
            <div className="console-head">
              <span className="console-title" style={{ color: "#8a8a8a" }}>
                SEARCH CONSOLE // <b style={{ color: "#e8e8e8" }}>TRIP.SCAN</b>
              </span>
              <span className="console-status">
                <span className="status-dot" /> LIVE
              </span>
            </div>
            <SearchForm />
          </div>
        </div>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {marqueeRoutes.map((r, i) => (
              <span className="mq-chip" key={i}>
                <b>{titleCase(r.source)} → {titleCase(r.destination)}</b>
                <span className="dotsep">●</span> DAILY DEPARTURES
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-strip">
        <div className="container">
          <div className="stats-grid">
            <div className="stat">
              <div className="stat-num">{routes.length > 0 ? routes.length : "—"}<span className="red">.</span></div>
              <div className="stat-label">Routes live</div>
            </div>
            <div className="stat">
              <div className="stat-num">{cities > 0 ? cities : "—"}<span className="red">.</span></div>
              <div className="stat-label">Cities served</div>
            </div>
            <div className="stat">
              <div className="stat-num">02<span className="red">.</span></div>
              <div className="stat-label">Taps to your seat</div>
            </div>
            <div className="stat">
              <div className="stat-num">00<span className="red">.</span></div>
              <div className="stat-label">Cancellation fee</div>
            </div>
          </div>
        </div>
      </section>

      {routes.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <span className="kicker">01 // Popular routes</span>
              <h2>WHERE NEXT?</h2>
              <p>Departing {tomorrowISO()} — tap a route to scan every trip on it.</p>
            </div>
            <div className="grid grid-4">
              {routes.map((r, i) => (
                <Link
                  key={i}
                  className="route-card"
                  to={`/search?from=${encodeURIComponent(titleCase(r.source))}&to=${encodeURIComponent(titleCase(r.destination))}&date=${tomorrowISO()}`}
                >
                  <span className="rc-glyph"><Bus /></span>
                  <span>
                    <span className="rc-route">{titleCase(r.source)} → {titleCase(r.destination)}</span>
                    <span className="rc-sub">Daily departures</span>
                  </span>
                  <span className="rc-go"><ArrowRight size={18} /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cinematic">
            <div className="starfield" />
            <div className="cinematic-glow" />
            <div className="cinematic-inner">
              <span className="kicker">02 // Protocol</span>
              <h2 className="display" style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", margin: "12px 0 0", color: "#fff" }}>
                THREE STEPS TO<br />THE WINDOW SEAT<span style={{ color: "var(--red)" }}>.</span>
              </h2>
              <div className="how-steps">
                {STEPS.map((s) => (
                  <div className="how-step" key={s.n}>
                    <div className="how-num">{s.n}</div>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
