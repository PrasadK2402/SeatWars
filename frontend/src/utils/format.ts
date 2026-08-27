export function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

export function formatTime(timeStr: string): string {
  if (!timeStr) return "-";
  // backend sends HH:mm:ss or HH:mm
  const parts = timeStr.split(":");
  if (parts.length >= 2) {
    const h = parseInt(parts[0], 10);
    const m = parts[1];
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${String(hour12).padStart(2, "0")}:${m} ${ampm}`;
  }
  return timeStr;
}

export function formatDateForInput(d: Date): string {
  return d.toISOString().split("T")[0];
}

export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}
