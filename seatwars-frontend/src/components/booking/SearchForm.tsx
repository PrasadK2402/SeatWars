import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftRight, Radar } from "lucide-react";
import { getRoutes } from "../../api/routes";
import { Alert } from "../ui/Alert";
import { Button } from "../ui/Button";
import { todayISO, titleCase, tomorrowISO } from "../../utils/format";

export interface SearchValues {
  from: string;
  to: string;
  date: string;
}

function shiftDate(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${dt.getFullYear()}-${mm}-${dd}`;
}

export function SearchForm({ initial }: { initial?: Partial<SearchValues> }) {
  const navigate = useNavigate();
  const [from, setFrom] = useState(initial?.from ?? "");
  const [to, setTo] = useState(initial?.to ?? "");
  const [date, setDate] = useState(initial?.date ?? tomorrowISO());
  const [places, setPlaces] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRoutes()
      .then((routes) => {
        const set = new Set<string>();
        routes.forEach((r) => {
          set.add(titleCase(r.source));
          set.add(titleCase(r.destination));
        });
        setPlaces([...set].sort());
      })
      .catch(() => {});
  }, []);

  const datalistId = useMemo(() => `places-${Math.random().toString(36).slice(2)}`, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const f = from.trim();
    const t = to.trim();
    if (!f || !t) return setError("PLEASE ENTER BOTH ORIGIN AND DESTINATION.");
    if (f.toLowerCase() === t.toLowerCase()) return setError("ORIGIN AND DESTINATION CAN'T BE THE SAME.");
    if (!date) return setError("PLEASE PICK A TRAVEL DATE.");
    if (date < todayISO()) return setError("TRAVEL DATE CAN'T BE IN THE PAST.");
    navigate(`/search?from=${encodeURIComponent(f)}&to=${encodeURIComponent(t)}&date=${date}`);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div>
      {error && (
        <div className="search-error">
          <Alert kind="error">{error}</Alert>
        </div>
      )}
      <form id="bus-search-form" onSubmit={submit} aria-label="Search buses">
        <div className="search-grid">
          <div className="search-field">
            <label htmlFor="sw-from">Origin</label>
            <input
              id="sw-from"
              list={datalistId}
              placeholder="Leaving from"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="swap-cell">
            <button type="button" className="swap-btn" onClick={swap} aria-label="Swap origin and destination" title="Swap">
              <ArrowLeftRight />
            </button>
          </div>

          <div className="search-field">
            <label htmlFor="sw-to">Destination</label>
            <input
              id="sw-to"
              list={datalistId}
              placeholder="Going to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="search-field">
            <label htmlFor="sw-date">Date</label>
            <input
              id="sw-date"
              type="date"
              value={date}
              min={todayISO()}
              onChange={(e) => setDate(e.target.value)}
            />
            <div className="date-chips">
              <button type="button" className="date-chip" onClick={() => setDate(todayISO())}>Today</button>
              <button type="button" className="date-chip" onClick={() => setDate(tomorrowISO())}>Tmrw</button>
              <button type="button" className="date-chip" onClick={() => setDate(shiftDate(date || todayISO(), 2))}>+2d</button>
            </div>
          </div>

          <div className="search-go">
            <Button type="submit" size="lg">
              <Radar /> Scan
            </Button>
          </div>
        </div>
        <datalist id={datalistId}>
          {places.map((p) => (
            <option key={p} value={p} />
          ))}
        </datalist>
      </form>
    </div>
  );
}
