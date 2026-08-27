import { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Search } from "lucide-react";
import type { Route } from "../../types";

interface Props {
  routes: Route[];
  initial?: { source: string; destination: string; travelDate: string };
  onSearch: (data: { source: string; destination: string; travelDate: string }) => void;
  loading?: boolean;
}

export function SearchForm({ routes, initial, onSearch, loading }: Props) {
  const [source, setSource] = useState(initial?.source || "");
  const [destination, setDestination] = useState(initial?.destination || "");
  const [travelDate, setTravelDate] = useState(initial?.travelDate || new Date().toISOString().split("T")[0]);

  // Derive unique sources/destinations from routes for suggestions
  const sources = [...new Set(routes.map((r) => r.source))];
  const destinations = [...new Set(routes.map((r) => r.destination))];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !destination || !travelDate) return;
    onSearch({ source, destination, travelDate });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-4 items-end">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">From</label>
        <input
          list="sources"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="e.g. Pune"
          className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          required
        />
        <datalist id="sources">
          {sources.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">To</label>
        <input
          list="dests"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="e.g. Mumbai"
          className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          required
        />
        <datalist id="dests">
          {destinations.map((d) => (
            <option key={d} value={d} />
          ))}
        </datalist>
      </div>

      <Input label="Travel Date" type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} required />

      <Button type="submit" loading={loading} className="w-full sm:w-auto h-[42px]">
        <Search size={16} className="mr-2" /> Search Buses
      </Button>
    </form>
  );
}
