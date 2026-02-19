import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  Bus,
  PlusCircle,
  MapPin,
  Users,
  IndianRupee,
  Edit,
  Trash2,
  Loader
} from "lucide-react";

const MyBuses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/provider/buses");
      setBuses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch Buses Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
        <Loader className="spin text-primary" size={40} />
        <p className="mt-3 fw-bold text-muted">Loading your fleet…</p>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-neutral-50 py-5">
      <div className="container">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 className="fw-800 mb-1">My Buses</h2>
            <p className="text-muted mb-0">
              Manage your active routes and vehicles
            </p>
          </div>
          <Link
            to="/provider/buses/add"
            className="btn btn-primary rounded-pill fw-bold d-flex align-items-center gap-2"
          >
            <PlusCircle size={18} /> Add Bus
          </Link>
        </div>

        {/* EMPTY STATE */}
        {buses.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-5 border border-dashed shadow-sm">
            <Bus size={48} className="text-muted mb-3" />
            <h4 className="fw-bold">No buses added yet</h4>
            <p className="text-muted">
              Add your first bus to start accepting bookings
            </p>
            <Link
              to="/provider/buses/add"
              className="btn btn-primary rounded-pill px-4"
            >
              Add Bus
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {buses.map((bus) => {
              const seats = bus.seats || [];
              const availableSeats = seats.filter(
                s => s.status === "AVAILABLE"
              ).length;

              return (
                <div className="col-md-6 col-xl-4" key={bus._id}>
                  <div className="card border-0 shadow-sm rounded-4 h-100 bus-card">
                    <div className="card-body p-4 d-flex flex-column">

                      {/* TOP */}
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <span className="badge bg-primary-subtle text-primary rounded-pill">
                          ACTIVE
                        </span>
                        <span className="fw-bold text-success">
                          ₹{bus.pricePerSeat}
                        </span>
                      </div>

                      <h5 className="fw-bold mb-2">{bus.busName}</h5>

                      {/* ROUTE */}
                      <div className="route-box mb-3">
                        <MapPin size={14} />
                        <span className="fw-semibold">
                          {bus.departure} → {bus.destination}
                        </span>
                      </div>

                      {/* STATS */}
                      <div className="row g-2 mb-4">
                        <div className="col-6">
                          <div className="stat-pill">
                            <Users size={14} />
                            {availableSeats}/{bus.totalSeats} Seats
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="stat-pill">
                            <IndianRupee size={14} />
                            Fare ₹{bus.pricePerSeat}
                          </div>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="mt-auto d-flex gap-2">
                        <Link
                          to={`/provider/buses/edit/${bus._id}`}
                          className="btn btn-outline-primary w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
                        >
                          <Edit size={16} /> Edit
                        </Link>
                        <button
                          className="btn btn-outline-danger w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
                          onClick={() => alert("Delete API not wired yet")}
                        >
                          <Trash2 size={16} /> Remove
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* STYLES */}
      <style>{`
        .fw-800 { font-weight: 800; }
        .spin { animation: spin 1s linear infinite; }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .bus-card {
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }
        .bus-card:hover {
          transform: translateY(-5px);
          border-color: #2563eb;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.08);
        }

        .route-box {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: #475569;
          background: #f1f5f9;
          padding: 6px 10px;
          border-radius: 12px;
        }

        .stat-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f8fafc;
          padding: 6px 10px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #334155;
          border: 1px solid #e2e8f0;
        }
      `}</style>
    </div>
  );
};

export default MyBuses;
