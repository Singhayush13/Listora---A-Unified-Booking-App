import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { 
  Hotel, Bus, User, Calendar, CreditCard, 
  CheckCircle, XCircle, ArrowRight, Wallet, 
  Clock, TrendingUp 
} from "lucide-react";

export default function BookingRequests() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("HOTEL");
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    setLoading(true);
    api.get("/provider/bookings")
      .then(res => {
        setBookings(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const updateStatus = async (id, action) => {
  try {
    setProcessingId(id);

    // ✅ SINGLE UNIFIED ROUTE
    await api.post(`/provider/bookings/${id}/${action}`);

    // remove booking from UI after action
    setBookings(prev => prev.filter(b => b._id !== id));
  } catch (err) {
    console.error("Update Status Error:", err);
    alert(`Failed to ${action} booking`);
  } finally {
    setProcessingId(null);
  }
};



  const filteredBookings = bookings.filter(b => b.bookingType === activeTab);

  /* ============================
      REVENUE CALCULATIONS
  ============================ */
  const stats = {
    count: filteredBookings.length,
    totalRevenue: filteredBookings.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0)
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-grow text-primary" role="status" />
        <p className="mt-3 fw-bold text-secondary">Analyzing your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-5 bg-light min-vh-100">
      <div className="container">
        
        {/* HEADER SECTION */}
        <div className="row align-items-center mb-5">
          <div className="col-lg-6">
            <h2 className="fw-800 text-dark mb-1">Provider Dashboard</h2>
            <p className="text-muted mb-0">Review and manage incoming booking requests</p>
          </div>
          <div className="col-lg-6 d-flex justify-content-lg-end mt-3 mt-lg-0">
            <div className="nav-pill-wrapper p-1 bg-white rounded-pill shadow-sm border">
              <button 
                className={`btn rounded-pill px-4 fw-bold d-flex align-items-center gap-2 transition-all ${activeTab === "HOTEL" ? "btn-primary shadow-sm" : "btn-light text-muted border-0"}`}
                onClick={() => setActiveTab("HOTEL")}
              >
                <Hotel size={18} /> Hotels
              </button>
              <button 
                className={`btn rounded-pill px-4 fw-bold d-flex align-items-center gap-2 transition-all ${activeTab === "BUS" ? "btn-primary shadow-sm" : "btn-light text-muted border-0"}`}
                onClick={() => setActiveTab("BUS")}
              >
                <Bus size={18} /> Buses
              </button>
            </div>
          </div>
        </div>

        {/* REVENUE SUMMARY CARDS */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
              <div className="d-flex align-items-center gap-3">
                <div className="p-3 bg-primary-subtle rounded-4 text-primary">
                  <Wallet size={24} />
                </div>
                <div>
                  <small className="text-muted fw-bold text-uppercase d-block">Pending Revenue</small>
                  <h3 className="fw-800 mb-0 text-dark">₹{stats.totalRevenue.toLocaleString()}</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
              <div className="d-flex align-items-center gap-3">
                <div className="p-3 bg-warning-subtle rounded-4 text-warning">
                  <Clock size={24} />
                </div>
                <div>
                  <small className="text-muted fw-bold text-uppercase d-block">Pending Requests</small>
                  <h3 className="fw-800 mb-0 text-dark">{stats.count}</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-primary text-white h-100">
              <div className="d-flex align-items-center gap-3">
                <div className="p-3 bg-white bg-opacity-25 rounded-4">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <small className="fw-bold text-uppercase d-block opacity-75">Service Type</small>
                  <h3 className="fw-800 mb-0">{activeTab}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOOKING CARDS GRID */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-5 rounded-5 bg-white border border-2 border-dashed shadow-sm">
            <div className="bg-light d-inline-block p-4 rounded-circle mb-3">
              <CheckCircle size={40} className="text-success" />
            </div>
            <h4 className="fw-bold text-dark">Zero Pending Tasks</h4>
            <p className="text-muted">You've cleared all your {activeTab.toLowerCase()} booking requests.</p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredBookings.map(booking => (
              <div className="col-xl-4 col-md-6" key={booking._id}>
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 booking-card">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between mb-3">
                      <span className="badge bg-light text-primary border border-primary-subtle px-3 py-2 rounded-pill small">
                        REF: {booking._id.slice(-8).toUpperCase()}
                      </span>
                      <span className="text-success fw-800 h5 mb-0">₹{booking.amountPaid}</span>
                    </div>

                    <h5 className="fw-bold text-dark mb-1">
                      {activeTab === "HOTEL" ? booking.hotel?.name : booking.bus?.busName}
                    </h5>
                    <p className="text-muted small mb-4 d-flex align-items-center gap-1">
                       Customer: <span className="text-dark fw-bold">{booking.user?.name || "Guest"}</span>
                    </p>

                    <div className="p-3 bg-light rounded-4 mb-4">
                      <div className="row g-2">
                        <div className="col-6">
                          <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '10px' }}>
                            {activeTab === "HOTEL" ? "Room" : "Seat"}
                          </small>
                          <span className="fw-bold">{activeTab === "HOTEL" ? booking.room?.roomNumber : (booking.seat?.seatNumber || booking.seatNumber)}</span>
                        </div>
                        <div className="col-6 border-start ps-3">
                          <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '10px' }}>Schedule</small>
                          <span className="fw-bold small">{new Date(booking.fromDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="row g-2 mt-auto">
                      <div className="col-6">
                        <button
                          disabled={processingId === booking._id}
                          className="btn btn-success w-100 py-2 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                          onClick={() => updateStatus(booking._id, "accept")}
                        >
                          {processingId === booking._id ? <span className="spinner-border spinner-border-sm" /> : <CheckCircle size={18} />}
                          Approve
                        </button>
                      </div>
                      <div className="col-6">
                        <button
                          disabled={processingId === booking._id}
                          className="btn btn-outline-danger w-100 py-2 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                          onClick={() => updateStatus(booking._id, "reject")}
                        >
                          <XCircle size={18} />
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .fw-800 { font-weight: 800; }
        .bg-primary-subtle { background-color: #e7f1ff; }
        .bg-warning-subtle { background-color: #fff3cd; }
        .booking-card { transition: all 0.3s ease; border: 1px solid transparent !important; }
        .booking-card:hover { transform: translateY(-5px); border-color: #0d6efd !important; box-shadow: 0 1rem 3rem rgba(0,0,0,.1) !important; }
        .transition-all { transition: all 0.2s ease; }
      `}</style>
    </div>
  );
}