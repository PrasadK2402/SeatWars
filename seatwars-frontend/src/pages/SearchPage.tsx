import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, Pencil, Radar, SlidersHorizontal } from "lucide-react";
import { searchTrips, getTripSeats } from "../api/trips";
import { getErrorMessage } from "../api/client";
import type { Trip, TripSeat } from "../types";
import { SearchForm } from "../components/booking/SearchForm";
import { TripRow } from "../components/booking/TripRow";
import { Alert } from "../components/ui/Alert";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingBlock } from "../components/ui/Spinner";
import { Select } from "../components/ui/Form";
import { Button } from "../components/ui/Button";
import { formatDate, titleCase } from "../utils/format";

type Slot = "all" | "morning" | "afternoon" | "evening" | "night";
type Sort = "departure" | "arrival" | "duration" | "seats";

const SLOTS: { id: Slot; label: string; hint: string }[] = [
  { id: "morning", label: "Morning", hint: "05–12" },
  { id: "afternoon", label: "Afternoon", hint: "12–17" },
  { id: "evening", label: "Evening", hint: "17–21" },
  { id: "night", label: "Night", hint: "21–05" },
];

function slotOf(time: string): Exclude<Slot, "all"> {
  const h = Number(time.split(":")[0]);
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 21) return "evening";
  return "night";
}

function durationMin(trip: Trip): number {
  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + (m || 0);
  };
  let d = toMin(trip.arrivalTime) - toMin(trip.departureTime);
  if (d <= 0) d += 24 * 60;
  return d;
}

export function SearchPage() {
  const [params] = useSearchParams();
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";
  const date = params.get("date") ?? "";

  const [trips, setTrips] = useState<Trip[]>([]);
  const [seatsMap, setSeatsMap] = useState<Record<number, TripSeat[] | null>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slot, setSlot] = useState<Slot>("all");
  const [sort, setSort] = useState<Sort>("departure");
  const [hideSoldOut, setHideSoldOut] = useState(false);
  const [modifyOpen, setModifyOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const hasQuery = from.trim() !== "" && to.trim() !== "" && date !== "";

  useEffect(() => {
    if (!hasQuery) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setTrips([]);
    setSeatsMap({});
    setExpandedId(null);

    searchTrips({ source: from.trim(), destination: to.trim(), travelDate: date })
      .then(async (results) => {
        if (cancelled) return;
        setTrips(results);
        const entries = await Promise.all(
          results.map(async (t) => {
            try {
              const seats = await getTripSeats(t.id);
              return [t.id, seats] as const;
            } catch {
              return [t.id, null] as const;
            }
          })
        );
        if (!cancelled) setSeatsMap(Object.fromEntries(entries));
      })
      .catch((e) => {
        if (!cancelled) setError(getErrorMessage(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, date]);

  const slotCounts = useMemo(() => {
    const counts: Record<string, number> = { morning: 0, afternoon: 0, evening: 0, night: 0 };
    trips.forEach((t) => {
      counts[slotOf(t.departureTime)]++;
    });
    return counts;
  }, [trips]);

  const visible = useMemo(() => {
    let filtered = trips.filter((t) => slot === "all" || slotOf(t.departureTime) === slot);
    if (hideSoldOut) {
      filtered = filtered.filter((t) => {
        const seats = seatsMap[t.id];
        return !seats || seats.some((s) => s.status === "AVAILABLE");
      });
    }
    const seatsLeft = (t: Trip) => seatsMap[t.id]?.filter((s) => s.status === "AVAILABLE").length ?? -1;
    const by: Record<Sort, (a: Trip, b: Trip) => number> = {
      departure: (a, b) => a.departureTime.localeCompare(b.departureTime),
      arrival: (a, b) => a.arrivalTime.localeCompare(b.arrivalTime),
      duration: (a, b) => durationMin(a) - durationMin(b),
      seats: (a, b) => seatsLeft(b) - seatsLeft(a),
    };
    return [...filtered].sort(by[sort]);
  }, [trips, slot, sort, hideSoldOut, seatsMap]);

  return (
    <div className="page">
      <div className="container">
        <div className="results-head">
          <span className="kicker">SCAN RESULTS</span>
          {hasQuery ? (
            <>
              <h1 className="results-route">
                {titleCase(from)} <span className="arrow">→</span> {titleCase(to)}
              </h1>
              <div className="results-meta">
                {formatDate(date)}
                {!loading && trips.length > 0 && <> // {visible.length} OF {trips.length} TRIPS</>}
              </div>
            </>
          ) : (
            <>
              <h1 className="results-route">NO COORDINATES<span style={{ color: "var(--red)" }}>.</span></h1>
              <div className="results-meta">RUN A SCAN TO SEE LIVE TRIPS</div>
            </>
          )}
        </div>

        <div className="console mt-3" style={{ marginBottom: 4 }}>
          <div className="console-head">
            <span className="console-title">SEARCH CONSOLE // <b>MODIFY.SCAN</b></span>
            <Button variant="ghost" size="sm" onClick={() => setModifyOpen((o) => !o)}>
              <Pencil size={14} /> {modifyOpen ? "Collapse" : "Modify"}
              <ChevronDown size={14} style={{ transform: modifyOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </Button>
          </div>
          {modifyOpen && (
            <div style={{ background: "#0c0c0c", borderTop: "1px solid #232323" }}>
              <SearchForm initial={{ from, to, date }} />
            </div>
          )}
        </div>

        {!hasQuery ? (
          <EmptyState
            icon={Radar}
            title="WHERE TO?"
            description="Enter origin, destination and date in the console above to scan for live trips."
          />
        ) : (
          <>
            {error && <Alert kind="error">{error}</Alert>}
            {loading ? (
              <LoadingBlock label="SCANNING TRIPS" />
            ) : trips.length === 0 && !error ? (
              <EmptyState
                icon={Radar}
                title="NO SIGNAL"
                description="No trips on this route for the selected date. Try a different date."
              />
            ) : (
              <div className="results-layout">
                <aside className="console filter-console" aria-label="Filters">
                  <div className="console-head">
                    <span className="console-title">FILTER // <b>PARAMETERS</b></span>
                    <SlidersHorizontal size={14} style={{ color: "var(--red)" }} />
                  </div>
                  <div className="filter-group">
                    <h4>Departure window</h4>
                    <div className="slot-list">
                      <button
                        type="button"
                        className={`slot-btn${slot === "all" ? " active" : ""}`}
                        onClick={() => setSlot("all")}
                      >
                        <span>All day</span>
                        <span className="cnt">{trips.length}</span>
                      </button>
                      {SLOTS.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          className={`slot-btn${slot === s.id ? " active" : ""}`}
                          onClick={() => setSlot(s.id)}
                        >
                          <span>{s.label}<small>{s.hint}</small></span>
                          <span className="cnt">{slotCounts[s.id]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-group">
                    <h4>Availability</h4>
                    <label className="check-row">
                      <input
                        type="checkbox"
                        checked={hideSoldOut}
                        onChange={(e) => setHideSoldOut(e.target.checked)}
                      />
                      Hide sold out
                    </label>
                  </div>
                  <div className="filter-group">
                    <h4>Sort by</h4>
                    <Select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                      <option value="departure">Departure · earliest</option>
                      <option value="arrival">Arrival · earliest</option>
                      <option value="duration">Duration · shortest</option>
                      <option value="seats">Seats left · most</option>
                    </Select>
                  </div>
                </aside>

                <div>
                  {visible.length === 0 ? (
                    <EmptyState
                      icon={Radar}
                      title="FILTERED OUT"
                      description="No trips match these parameters. Widen the departure window."
                    />
                  ) : (
                    <div className="grid" style={{ gap: 14 }}>
                      {visible.map((t, i) => (
                        <TripRow
                          key={t.id}
                          index={i}
                          trip={t}
                          seats={seatsMap[t.id] ?? null}
                          seatsLoading={!(t.id in seatsMap)}
                          expanded={expandedId === t.id}
                          onToggle={() => setExpandedId((id) => (id === t.id ? null : t.id))}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
