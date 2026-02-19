import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiMapPin,
  FiExternalLink,
  FiLoader,
  FiShoppingBag,
  FiInfo,
  FiCalendar,
  FiDownload,
  FiChevronRight,
  FiCoffee,
  FiTruck
} from "react-icons/fi";
import api from "../services/api";

const downloadInvoice = (id) => {
  window.open(`${import.meta.env.VITE_API_URL}/bookings/invoice/${id}/pdf`, "_blank");
};

const getStatusStyle = (status) => {
  switch (status) {
    case "CONFIRMED": return { bg: "rgba(16, 185, 129, 0.1)", text: "#059669", border: "#10b981" };
    case "REJECTED": return { bg: "rgba(239, 68, 68, 0.1)", text: "#dc2626", border: "#ef4444" };
    default: return { bg: "rgba(245, 158, 11, 0.1)", text: "#d97706", border: "#f59e0b" };
  }
};

/* =========================
   REUSABLE UI COMPONENTS
========================= */
const BookingStatus = ({ statusText }) => {
  const style = getStatusStyle(statusText);
  return (
    <span className="status-badge" style={{ backgroundColor: style.bg, color: style.text, borderColor: style.border }}>
      {statusText}
    </span>
  );
};

/* =========================
   HOTEL BOOKING CARD
========================= */
const HotelCard = ({ b }) => (
  <div className="booking-glass-card hotel-type">
    <div className="card-top">
      <div className="type-tag"><FiCoffee /> HOTEL STAY</div>
      <span className="id-tag">#{b._id.slice(-8).toUpperCase()}</span>
    </div>
    <div className="card-main">
      <h5 className="entity-name">{b.hotel?.name}</h5>
      <div className="details-grid">
        <div className="detail-item">
          <FiCalendar className="icon" />
          <span>{new Date(b.fromDate).toLocaleDateString()} - {new Date(b.toDate).toLocaleDateString()}</span>
        </div>
        <div className="detail-item">
          <FiInfo className="icon" />
          <span>Room: <strong>{b.room?.roomNumber || "Pending"}</strong></span>
        </div>
        <div className="detail-item full-width">
          <FiMapPin className="icon" />
          <span>{b.hotel?.address}</span>
        </div>
      </div>
    </div>
    <div className="card-footer">
      <div className="price-section">
        <label>Total Paid</label>
        <span className="price-amount">₹{b.amountPaid}</span>
      </div>
      <div className="action-row">
        <BookingStatus statusText={b.status} />
        <div className="btn-group-custom">
          <Link to={`/hotels/${b.hotel?._id}`} className="icon-btn" title="View Hotel"><FiExternalLink /></Link>
          <Link to={`/invoice/${b._id}`} className="text-btn">Invoice</Link>
        </div>
      </div>
    </div>
  </div>
);

/* =========================
   BUS BOOKING CARD
========================= */
const BusCard = ({ b }) => (
  <div className="booking-glass-card bus-type">
    <div className="card-top">
      <div className="type-tag"><FiTruck /> TRANSIT</div>
      <span className="id-tag">#{b._id.slice(-8).toUpperCase()}</span>
    </div>
    <div className="card-main">
      <h5 className="entity-name">{b.bus?.busName}</h5>
      <div className="route-timeline">
        <div className="station">
          <span className="city">{b.bus?.departure}</span>
        </div>
        <div className="path">
          <div className="dot"></div>
          <div className="line"></div>
          <div className="dot"></div>
        </div>
        <div className="station">
          <span className="city">{b.bus?.destination}</span>
        </div>
      </div>
      <div className="details-row">
        <span><FiCalendar /> {new Date(b.fromDate).toDateString()}</span>
        <span>Seat: <strong>{b.seat?.seatNumber || "Assigning..."}</strong></span>
      </div>
    </div>
    <div className="card-footer">
      <div className="price-section">
        <label>Fare</label>
        <span className="price-amount">₹{b.amountPaid}</span>
      </div>
      <div className="action-row">
        <BookingStatus statusText={b.status} />
        <Link to={`/invoice/${b._id}`} className="text-btn">
          Invoice
        </Link>
      </div>
    </div>
  </div>
);

/* =========================
   MAIN PAGE
========================= */
const MyBookings = () => {
  const [activeTab, setActiveTab] = useState("HOTEL"); // HOTEL or BUS
  const [bookings, setBookings] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/bookings/my")
      .then((res) => setBookings(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filterByType = (list) => list.filter(item => item.bookingType === activeTab);

  if (loading) return (
    <div className="loader-full">
      <FiLoader className="spin" />
      <p>Fetching your itineraries...</p>
    </div>
  );

  return (
    <div className="bookings-page">
      <div className="page-header">
        <div className="container">
          <h2 className="page-title">My Itineraries</h2>
          <div className="tab-switcher">
            <button className={activeTab === "HOTEL" ? "active" : ""} onClick={() => setActiveTab("HOTEL")}>Hotels</button>
            <button className={activeTab === "BUS" ? "active" : ""} onClick={() => setActiveTab("BUS")}>Buses</button>
          </div>
        </div>
      </div>

      <div className="container py-5">
        {/* Upcoming Section */}
        <section className="booking-section">
          <div className="section-header">
            <h4>Upcoming Journeys</h4>
            <span className="count-pill">{filterByType(bookings.upcoming).length}</span>
          </div>
          
          <div className="row g-4">
            {filterByType(bookings.upcoming).length > 0 ? (
              filterByType(bookings.upcoming).map(b => (
                <div className="col-lg-6 col-xl-4" key={b._id}>
                  {activeTab === "HOTEL" ? <HotelCard b={b} /> : <BusCard b={b} />}
                </div>
              ))
            ) : (
              <div className="col-12 empty-state">
                <FiShoppingBag size={40} />
                <p>No upcoming {activeTab.toLowerCase()} bookings.</p>
              </div>
            )}
          </div>
        </section>

        {/* Past Section */}
        {filterByType(bookings.past).length > 0 && (
          <section className="booking-section mt-5">
            <div className="section-header">
              <h4>Travel History</h4>
            </div>
            <div className="row g-4 opacity-75">
              {filterByType(bookings.past).map(b => (
                <div className="col-lg-6 col-xl-4" key={b._id}>
                  {activeTab === "HOTEL" ? <HotelCard b={b} /> : <BusCard b={b} />}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <style>{`
        .bookings-page { background: #f8fafc; min-height: 100vh; }
        
        /* Header & Tabs */
        .page-header { background: #fff; border-bottom: 1px solid #e2e8f0; padding: 2rem 0; }
        .page-title { font-weight: 800; color: #1e293b; margin-bottom: 1.5rem; }
        
        .tab-switcher { 
          display: inline-flex; 
          background: #f1f5f9; 
          padding: 4px; 
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        .tab-switcher button {
          border: none; padding: 8px 24px; border-radius: 8px; font-weight: 600;
          color: #64748b; transition: all 0.2s;
        }
        .tab-switcher button.active { background: white; color: #2563eb; shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }

        /* Section Styling */
        .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 1.5rem; }
        .section-header h4 { font-weight: 700; margin: 0; font-size: 1.1rem; color: #475569; }
        .count-pill { background: #e2e8f0; padding: 2px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; }

        /* Professional Card Design */
        .booking-glass-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          padding: 1.5rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .booking-glass-card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05); border-color: #2563eb; }

        .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .type-tag { font-size: 0.65rem; font-weight: 800; color: #64748b; letter-spacing: 0.05em; display: flex; align-items: center; gap: 5px; }
        .id-tag { font-family: monospace; color: #94a3b8; font-size: 0.8rem; }

        .entity-name { font-weight: 800; color: #1e293b; margin-bottom: 1rem; }
        
        /* Grid Details */
        .details-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
        .detail-item { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: #475569; }
        .detail-item .icon { color: #94a3b8; }
        .full-width { grid-column: span 1; border-top: 1px solid #f1f5f9; pt: 10px; }

        /* Route Timeline for Bus */
        .route-timeline { display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; }
        .station .city { font-weight: 700; color: #1e293b; font-size: 0.9rem; }
        .path { flex-grow: 1; display: flex; align-items: center; gap: 4px; }
        .path .line { height: 2px; flex-grow: 1; background: #e2e8f0; }
        .path .dot { width: 6px; height: 6px; border-radius: 50%; background: #cbd5e1; }
        .details-row { display: flex; gap: 15px; font-size: 0.8rem; color: #64748b; margin-top: 10px; }

        /* Footer & Actions */
        .card-footer { margin-top: auto; padding-top: 1.5rem; border-top: 1px dashed #e2e8f0; }
        .price-section { margin-bottom: 1rem; }
        .price-section label { display: block; font-size: 0.7rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; }
        .price-amount { font-size: 1.25rem; font-weight: 800; color: #1e293b; }

        .action-row { display: flex; justify-content: space-between; align-items: center; }
        .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; border: 1px solid; }

        .btn-group-custom { display: flex; gap: 8px; }
        .icon-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 8px; border: 1px solid #e2e8f0; color: #475569; transition: 0.2s; }
        .icon-btn:hover { background: #1e293b; color: white; }
        .text-btn, .download-btn { background: #2563eb; color: white; border: none; padding: 6px 14px; border-radius: 8px; font-size: 0.8rem; font-weight: 600; text-decoration: none; display: flex; align-items: center; gap: 5px; }
        .text-btn:hover { background: #1d4ed8; color: white; }

        .loader-full { height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #64748b; }
        .spin { animation: spin 1s linear infinite; font-size: 2rem; margin-bottom: 1rem; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .empty-state { text-align: center; padding: 3rem; background: white; border-radius: 20px; border: 2px dashed #e2e8f0; color: #94a3b8; }
      `}</style>
    </div>
  );
};

export default MyBookings;