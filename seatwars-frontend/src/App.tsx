import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { RequireAdmin, RequireAuth } from "./components/auth/guards";
import { AdminLayout } from "./components/admin/AdminLayout";
import { HomePage } from "./pages/HomePage";
import { SearchPage } from "./pages/SearchPage";
import { TripDetailPage } from "./pages/TripDetailPage";
import { BookingSuccessPage } from "./pages/BookingSuccessPage";
import { MyBookingsPage } from "./pages/MyBookingsPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { DashboardPage } from "./pages/admin/DashboardPage";
import { BusesPage } from "./pages/admin/BusesPage";
import { BusSeatsPage } from "./pages/admin/BusSeatsPage";
import { RoutesPage } from "./pages/admin/RoutesPage";
import { TripsPage } from "./pages/admin/TripsPage";

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route element={<RequireAuth />}>
                <Route path="/trips/:tripId" element={<TripDetailPage />} />
                <Route path="/booking/success" element={<BookingSuccessPage />} />
                <Route path="/my-bookings" element={<MyBookingsPage />} />
              </Route>

              <Route path="/admin" element={<RequireAdmin />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="buses" element={<BusesPage />} />
                  <Route path="buses/:busId/seats" element={<BusSeatsPage />} />
                  <Route path="routes" element={<RoutesPage />} />
                  <Route path="trips" element={<TripsPage />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Footer />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
