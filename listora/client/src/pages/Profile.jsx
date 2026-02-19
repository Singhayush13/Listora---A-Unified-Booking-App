import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Shield,
  LogOut,
  ShoppingBag,
  Hotel,
  Bus,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  MapPin,
  Calendar,
  Printer,
  Wind,
  Coffee,
  ArrowRight,
  Info
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await api.get("/bookings/my");
        const { upcoming = [], past = [] } = res.data || {};
        setBookings([...upcoming, ...past]);
      } catch (err) {
        console.error("Profile Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  if (!user) return <div className="text-center py-5">Please log in.</div>;

  const hotelBookings = bookings.filter((b) => b.bookingType === "HOTEL");
  const busBookings = bookings.filter((b) => b.bookingType === "BUS");
  const totalSpent = bookings.reduce((sum, b) => sum + (b.amountPaid || 0), 0);

  const getStatusBadge = (status) => {
    const styles = {
      CONFIRMED: "bg-success-subtle text-success border-success",
      REJECTED: "bg-danger-subtle text-danger border-danger",
      PENDING: "bg-warning-subtle text-warning border-warning"
    };
    return (
      <span className={`badge border px-2 py-1 ${styles[status] || styles.PENDING}`}>
        {status}
      </span>
    );
  };

  const BookingTable = ({ data, typeIcon, title, type }) => (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
      <div className="card-header bg-white py-3 px-4 border-bottom d-flex justify-content-between align-items-center">
        <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
          {typeIcon} {title}
        </h6>
        <span className="badge bg-light text-muted border fw-normal">{data.length} bookings</span>
      </div>
      <div className="card-body p-0">
        {data.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 custom-table">
              <thead>
                <tr>
                  <th className="ps-4">Service Details</th>
                  <th>Route / Room Info</th>
                  <th>Schedule & Cost</th>
                  <th className="text-center">Invoice</th>
                  <th className="text-end pe-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((b) => (
                  <tr key={b._id}>
                    <td className="ps-4 py-3">
                      <div className="fw-bold text-dark mb-0">
                        {type === "HOTEL" ? (b.hotel?.name || "Hotel") : (b.bus?.busName || "Bus Service")}
                      </div>
                      <div className="text-muted x-small d-flex align-items-center gap-1">
                        {type === "HOTEL" ? (
                          <><MapPin size={10} /> {b.hotel?.address || "View Address"}</>
                        ) : (
                          <><Wind size={10} /> {b.bus?.ac ? "AC" : "Non-AC"} • {b.bus?.suspension} Suspension</>
                        )}
                      </div>
                    </td>
                    <td>
                      {type === "HOTEL" ? (
                        <div className="small">
                          <span className="text-primary fw-medium">{b.room?.roomNumber || "Deluxe"}</span>
                          <div className="text-muted x-small">Standard Stay</div>
                        </div>
                      ) : (
                        <div className="small">
                          <div className="d-flex align-items-center gap-1 fw-medium text-dark">
                            {b.bus?.departure} <ArrowRight size={12} /> {b.bus?.destination}
                          </div>
                          <div className="text-muted x-small">Seat: {b.seat?.seatNumber}</div>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="small text-dark fw-medium">
                        <Calendar size={12} className="me-1" />
                        {new Date(b.fromDate).toLocaleDateString('en-GB')}
                        {type === "HOTEL" && ` - ${new Date(b.toDate).toLocaleDateString('en-GB')}`}
                      </div>
                      <div className="text-success x-small fw-bold">₹{b.amountPaid?.toLocaleString()}</div>
                    </td>
                    <td className="text-center">
                      <button 
                        onClick={() => navigate(`/invoice/${b._id}`)}
                        className="btn btn-outline-secondary btn-sm rounded-pill px-3 d-inline-flex align-items-center gap-2"
                        style={{ fontSize: '0.70rem' }}
                      >
                        <Printer size={13} /> View
                      </button>
                    </td>
                    <td className="text-end pe-4">{getStatusBadge(b.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5 text-center text-muted">
             <Info className="mb-2 opacity-25" size={40} />
             <p className="small mb-0">No {title.toLowerCase()} history available.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="profile-page-bg min-vh-100">
      <div className="profile-hero">
        <div className="container">
          <div className="profile-hero-content">
            <div className="avatar-wrapper shadow-lg bg-white">
              <img 
                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}&backgroundColor=b6e3f4,c0aede,d1d4f9`} 
                alt="Avatar" 
                className="avatar-img"
              />
            </div>
            <div className="profile-hero-text">
              <h2 className="text-white fw-bold mb-1">{user.name}</h2>
              <div className="d-flex flex-wrap gap-3">
                <span className="text-white-50 small d-flex align-items-center gap-1">
                  <Shield size={14} /> {user.role || "Customer"} Account
                </span>
                <span className="text-white-50 small d-flex align-items-center gap-1">
                  <Clock size={14} /> Member since {new Date().getFullYear()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-n5">
        <div className="row g-4">
          {/* Stats Row */}
          <div className="col-12">
            <div className="row g-3">
              {[
                { label: "Hotel Stays", value: hotelBookings.length, icon: <Hotel />, color: "#4f46e5" },
                { label: "Bus Trips", value: busBookings.length, icon: <Bus />, color: "#10b981" },
                { label: "Total Investment", value: `₹${totalSpent.toLocaleString()}`, icon: <TrendingUp />, color: "#f59e0b" },
              ].map((stat, i) => (
                <div key={i} className="col-md-4">
                  <div className="card border-0 shadow-sm rounded-4 p-3 stat-card bg-white h-100">
                    <div className="d-flex align-items-center gap-3">
                      <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                        {stat.icon}
                      </div>
                      <div>
                        <div className="text-muted small fw-medium">{stat.label}</div>
                        <div className="h5 fw-bold mb-0">{stat.value}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-4">
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3">Account Actions</h6>
                <div className="d-grid gap-2">
                  <button className="btn btn-light border btn-sm text-start py-2 px-3 rounded-3 small d-flex align-items-center gap-2">
                    <Shield size={16} className="text-primary" /> Security Settings
                  </button>
                  <button onClick={logout} className="btn btn-light border btn-sm text-danger text-start py-2 px-3 rounded-3 small d-flex align-items-center gap-2">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            </div>
            
            <div className="card border-0 shadow-sm rounded-4 bg-primary text-white p-4">
                <h6 className="fw-bold mb-2">Need Help?</h6>
                <p className="x-small text-white-50 mb-3">Contact our 24/7 support for any booking queries.</p>
                <button className="btn btn-white btn-sm w-100 fw-bold py-2" style={{ backgroundColor: 'white', color: '#1e293b'}}>Support Center</button>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            {loading ? (
              <div className="text-center p-5 card border-0 shadow-sm rounded-4 bg-white">
                <div className="spinner-border text-primary my-4" />
                <p className="text-muted">Loading your travel history...</p>
              </div>
            ) : (
              <>
                <BookingTable 
                  data={hotelBookings} 
                  type="HOTEL"
                  typeIcon={<Hotel size={18} className="text-primary" />} 
                  title="Your Hotel Stays" 
                />
                <BookingTable 
                  data={busBookings} 
                  type="BUS"
                  typeIcon={<Bus size={18} className="text-success" />} 
                  title="Your Bus Journeys" 
                />
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .profile-page-bg { background-color: #f8fafc; padding-bottom: 50px; }
        .profile-hero { background: linear-gradient(135deg, #0f172a 0%, #2563eb 100%); padding: 60px 0 100px 0; }
        .profile-hero-content { display: flex; align-items: center; gap: 24px; }
        .avatar-wrapper { width: 110px; height: 110px; border-radius: 24px; padding: 5px; }
        .avatar-img { width: 100%; height: 100%; border-radius: 20px; object-fit: cover; }
        .mt-n5 { margin-top: -50px !important; }
        .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .custom-table thead th { background: #f8fafc; font-size: 0.65rem; letter-spacing: 0.05rem; font-weight: 700; color: #64748b; border: none; padding: 15px 10px; text-transform: uppercase; }
        .x-small { font-size: 0.75rem; }
        .btn-white:hover { opacity: 0.9; }

        @media (max-width: 768px) {
          .profile-hero-content { flex-direction: column; text-align: center; }
          .profile-hero-text .d-flex { justify-content: center; }
          .custom-table thead { display: none; }
          .custom-table tr { display: block; border-bottom: 1px solid #f1f5f9; padding: 15px 0; }
          .custom-table td { display: block; text-align: left !important; padding: 5px 20px !important; border: none; }
        }
      `}</style>
    </div>
  );
}