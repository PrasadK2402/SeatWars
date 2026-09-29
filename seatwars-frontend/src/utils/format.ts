const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** "2026-09-30" -> "Wed, 30 Sep 2026" */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return `${DAYS[date.getDay()]}, ${d} ${MONTHS[m - 1]} ${y}`;
}

/** "2026-09-30" -> "30 Sep 2026" */
export function formatDateShort(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** "14:30:00" | "14:30" -> "2:30 PM" */
export function formatTime(t: string): string {
  const [hStr, mStr] = t.split(":");
  let h = Number(hStr);
  const m = mStr ?? "00";
  const suffix = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${suffix}`;
}

/** "2026-09-30T18:24:11" -> "30 Sep 2026, 6:24 PM" */
export function formatDateTime(iso: string): string {
  const [datePart, timePart] = iso.split("T");
  if (!timePart) return formatDate(datePart);
  return `${formatDateShort(datePart)}, ${formatTime(timePart.slice(0, 8))}`;
}

/** Duration between two LocalTime strings, e.g. "6h 30m". Handles overnight trips. */
export function tripDuration(departure: string, arrival: string): string {
  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + (m || 0);
  };
  let diff = toMin(arrival) - toMin(departure);
  if (diff <= 0) diff += 24 * 60;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function todayISO(): string {
  const d = new Date();
  return toISODate(d);
}

export function tomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toISODate(d);
}

function toISODate(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Booking id -> display reference like "SW-000123" */
export function bookingRef(id: number): string {
  return `SW-${String(id).padStart(6, "0")}`;
}

/** Capitalize the first letter of a city name. */
export function titleCase(s: string): string {
  return s
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(" ");
}
