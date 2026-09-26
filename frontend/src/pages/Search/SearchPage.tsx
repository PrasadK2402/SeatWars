import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchTrips } from "../../api/trips";
import { getRoutes } from "../../api/routes";
import type { Trip, Route } from "../../types";
import { SearchForm } from "../../components/booking/SearchForm";
import { TripCard } from "../../components/booking/TripCard";
import { Card, CardBody } from "../../components/ui/Card";
import { Spinner } from "../../components/ui/Spinner";
import { EmptyState, ErrorState } from "../../components/ui/EmptyState";
import { getErrorMessage } from "../../api/axios";

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const source = searchParams.get("source") || "";
  const destination = searchParams.get("destination") || "";
  const travelDate = searchParams.get("travelDate") || "";

  const [routes, setRoutes] = useState<Route[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    getRoutes().then(setRoutes).catch(() => {});
  }, []);

  useEffect(() => {
    if (source && destination && travelDate) {
      doSearch({ source, destination, travelDate });
    }
  }, [source, destination, travelDate]);

  const doSearch = async (data: { source: string; destination: string; travelDate: string }) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const res = await searchTrips(data);
      setTrips(res);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (data: { source: string; destination: string; travelDate: string }) => {
    const params = new URLSearchParams(data as Record<string, string>);
    navigate(`/search?${params.toString()}`);
    // effect will trigger search
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Card>
        <CardBody>
          <h2 className="text-lg font-semibold text-slate-900">Buses</h2>
          <div className="mt-4">
            <SearchForm routes={routes} initial={{ source, destination, travelDate }} onSearch={handleSearch} loading={loading} />
          </div>
        </CardBody>
      </Card>

      <div className="mt-6">
        {loading && <Spinner label="Searching buses..." />}
        {error && <ErrorState message={error} onRetry={() => doSearch({ source, destination, travelDate })} />}
        {!loading && !error && hasSearched && trips.length === 0 && (
          <EmptyState title="No trips found" description={`No trips available for ${source} → ${destination} on ${travelDate}. Try a different date or route.`} />
        )}
        {!loading && !error && trips.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">{trips.length} trip(s) found</p>
            {trips.map((t) => (
              <TripCard key={t.id} trip={t} onSelect={() => navigate(`/trips/${t.id}`)} />
            ))}
          </div>
        )}
        {!hasSearched && !loading && (
          <EmptyState title="Enter search details" description="Fill in From, To and Travel Date to find available buses." />
        )}
      </div>
    </div>
  );
}
