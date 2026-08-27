import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { AdminLayout } from "./components/layout/AdminLayout";
import { HomePage } from "./pages/Home/HomePage";
import { SearchPage } from "./pages/Search/SearchPage";
import { TripDetailPage } from "./pages/Trip/TripDetailPage";
import { ConfirmationPage } from "./pages/Booking/ConfirmationPage";
import { AdminDashboardPage } from "./pages/Admin/DashboardPage";
import { BusesPage } from "./pages/Admin/BusesPage";
import { BusSeatsPage } from "./pages/Admin/BusSeatsPage";
import { RoutesPage } from "./pages/Admin/RoutesPage";
import { TripsPage } from "./pages/Admin/TripsPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/trips/:tripId" element={<TripDetailPage />} />
          <Route path="/booking/confirmation" element={<ConfirmationPage />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="buses" element={<BusesPage />} />
            <Route path="buses/:busId/seats" element={<BusSeatsPage />} />
            <Route path="routes" element={<RoutesPage />} />
            <Route path="trips" element={<TripsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        
      </div>
    </BrowserRouter>
  );
}
