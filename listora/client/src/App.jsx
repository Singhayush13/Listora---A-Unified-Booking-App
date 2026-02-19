import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import NavbarSpacer from "./components/NavbarSpacer";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

/* ================= PUBLIC PAGES ================= */
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Hotels from "./pages/Hotels";
import HotelDetails from "./pages/HotelDetails";
import Invoice from "./pages/Invoice";

/* ================= USER ================= */
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";

/* ================= PROVIDER ================= */
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import MyHotels from "./pages/provider/MyHotels";
import AddHotel from "./pages/provider/AddHotel";
import MyBuses from "./pages/provider/MyBuses";
import AddBus from "./pages/provider/AddBus";
import EditHotel from "./pages/provider/EditHotel";
import BookingRequests from "./pages/provider/BookingRequests";

/* ================= ADMIN ================= */
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Providers from "./pages/admin/Providers";
import Analytics from "./pages/admin/Analytics";

/* ================= BUS ================= */
import Buses from "./pages/Buses";
import BusDetails from "./pages/BusDetails";
// (Optional later)



export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <NavbarSpacer />

      <div className="container mt-4">
        <Routes>

          {/* ================= PUBLIC ================= */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/invoice/:id" element={<Invoice />} />

          {/* ================= HOTELS ================= */}
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:id" element={<HotelDetails />} />

          {/* ================= BUS BOOKINGS ================= */}
          {/* Later you can add Bus list */}
          <Route path="/buses" element={<Buses />} />
          <Route path="/buses/:id" element={<BusDetails />} />

          <Route path="/provider/buses" element={
            <ProtectedRoute roles={["PROVIDER"]}>
              <MyBuses />
            </ProtectedRoute>
          } />

          <Route
            path="/provider/buses/add"
            element={
              <ProtectedRoute role="PROVIDER">
                <AddBus />
              </ProtectedRoute>
            }
          />


          {/* ================= USER ================= */}
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* ================= PROVIDER ================= */}
          <Route
            path="/provider"
            element={
              <ProtectedRoute role="PROVIDER">
                <ProviderDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/provider/hotels"
            element={
              <ProtectedRoute role="PROVIDER">
                <MyHotels />
              </ProtectedRoute>
            }
          />

          <Route
            path="/provider/hotels/add"
            element={
              <ProtectedRoute role="PROVIDER">
                <AddHotel />
              </ProtectedRoute>
            }
          />

          <Route
            path="/provider/hotels/edit/:id"
            element={
              <ProtectedRoute role="PROVIDER">
                <EditHotel />
              </ProtectedRoute>
            }
          />

          <Route
            path="/provider/bookings"
            element={
              <ProtectedRoute role="PROVIDER">
                <BookingRequests />
              </ProtectedRoute>
            }
          />

          {/* ================= ADMIN ================= */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="ADMIN">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="ADMIN">
                <Users />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/providers"
            element={
              <ProtectedRoute role="ADMIN">
                <Providers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute role="ADMIN">
                <Analytics />
              </ProtectedRoute>
            }
          />

        </Routes>
      </div>

      <Footer />
    </BrowserRouter>
  );
}
