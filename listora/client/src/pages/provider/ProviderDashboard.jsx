import React from "react";
import { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { 
  Hotel, Bus, PlusCircle, LayoutGrid, 
  BellRing, ClipboardList, Wallet, 
  ChevronRight, ArrowUpRight, Activity,
  Users, CheckCircle2, AlertCircle
} from "lucide-react";
import api from "../../services/api";

const ProviderDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pendingCount: 0,
    confirmedCount: 0,
    totalRevenue: 0,
    hotelCount: 0,
    busCount: 0,
    totalBookings: 0
  });

  useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Call the new dedicated stats route
      const response = await api.get("/provider/stats");
      
      // The data structure now comes pre-calculated from the server
      setStats({
        pendingCount: response.data.pendingCount,
        confirmedCount: response.data.confirmedCount,
        totalRevenue: response.data.totalRevenue,
        hotelCount: response.data.hotelCount,
        busCount: response.data.busCount,
        totalBookings: response.data.totalBookings
      });
    } catch (err) {
      console.error("Dashboard Sync Error", err);
    } finally {
      setLoading(false);
    }
  };
  fetchDashboardData();
}, []);

  return (
    <div className="dashboard-wrapper min-vh-100 bg-neutral-50">
      <div className="container py-4 py-lg-5">
        
        {/* ================= TOP NAVIGATION & WELCOME ================= */}
        <div className="row mb-4 gy-3 align-items-end">
          <div className="col-md-8">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-2">
                <li className="breadcrumb-item active fw-semibold text-primary">Overview</li>
                <li className="breadcrumb-item text-muted">Analytics</li>
              </ol>
            </nav>
            <h1 className="display-6 fw-800 text-slate-900 mb-0">
              Provider Hub <span className="text-primary">.</span>
            </h1>
          </div>
          <div className="col-md-4 text-md-end">
             <div className="d-inline-flex align-items-center gap-2 bg-white px-3 py-2 rounded-pill shadow-sm border">
                <span className="status-dot pulse-green"></span>
                <small className="fw-bold text-uppercase text-muted" style={{fontSize: '0.65rem'}}>System Live</small>
             </div>
          </div>
        </div>

        {/* ================= KEY PERFORMANCE INDICATORS ================= */}
        <div className="row g-3 mb-4">
          <StatCard 
            label="Gross Earnings" 
            value={`₹${stats.totalRevenue.toLocaleString()}`} 
            icon={<Wallet />} 
            trend="+12.5%" 
            color="success" 
          />
          <StatCard 
            label="Total Bookings" 
            value={stats.totalBookings} 
            icon={<Activity />} 
            trend="Live" 
            color="primary" 
          />
          <StatCard 
            label="Confirmed" 
            value={stats.confirmedCount} 
            icon={<CheckCircle2 />} 
            trend="Verified" 
            color="info" 
          />
          <StatCard 
            label="Services" 
            value={stats.hotelCount + stats.busCount} 
            icon={<LayoutGrid />} 
            subText={`${stats.hotelCount} Hotels | ${stats.busCount} Buses`} 
            color="dark" 
          />
        </div>

        {/* ================= URGENT ACTION AREA ================= */}
        <div className="row mb-5">
          <div className="col-12">
            <Link to="/provider/bookings" className="text-decoration-none">
              <div className="booking-alert-card rounded-5 p-4 p-md-5 d-flex flex-column flex-md-row justify-content-between align-items-center gap-4">
                <div className="d-flex align-items-center gap-4 text-center text-md-start flex-column flex-md-row">
                  <div className={`icon-box-lg ${stats.pendingCount > 0 ? 'pulse-warning' : ''}`}>
                    <BellRing size={32} />
                    {stats.pendingCount > 0 && <span className="notification-badge">{stats.pendingCount}</span>}
                  </div>
                  <div>
                    <h2 className="fw-bold text-white mb-1">Attention Required</h2>
                    <p className="text-white opacity-75 mb-0 fs-5">
                      {stats.pendingCount > 0 
                        ? `You have ${stats.pendingCount} pending booking requests needing approval.` 
                        : "Your queue is clear! All bookings are processed."}
                    </p>
                  </div>
                </div>
                <button className={`btn rounded-pill px-5 py-3 fw-bold shadow-lg transition-all ${stats.pendingCount > 0 ? 'btn-warning' : 'btn-outline-light'}`}>
                  Manage Requests <ChevronRight size={18} className="ms-2" />
                </button>
              </div>
            </Link>
          </div>
        </div>

        {/* ================= MANAGEMENT HUBS ================= */}
        <div className="row g-4">
          <ManagementHub 
            title="Hotel Management" 
            icon={<Hotel size={24} />}
            accent="primary"
            stats={`${stats.hotelCount} Active Properties`}
            actions={[
              { title: "Edit Inventory", desc: "Modify rooms & pricing", link: "/provider/hotels", icon: <LayoutGrid />, color: "primary" },
              { title: "New Property", desc: "Onboard hotel", link: "/provider/hotels/add", icon: <PlusCircle />, color: "success" }
            ]}
          />
          <ManagementHub 
            title="Fleet Management" 
            icon={<Bus size={24} />}
            accent="info"
            stats={`${stats.busCount} Live Routes`}
            actions={[
              { title: "Active Fleet", desc: "Seating & schedules", link: "/provider/buses", icon: <ClipboardList />, color: "info" },
              { title: "Add Vehicle", desc: "Register bus", link: "/provider/buses/add", icon: <PlusCircle />, color: "dark" }
            ]}
          />
        </div>
      </div>

      <style>{`
        :root {
          --slate-900: #0f172a;
          --primary: #2563eb;
        }
        body { background-color: #f8fafc; font-family: 'Plus Jakarta Sans', sans-serif; }
        .fw-800 { font-weight: 800; }
        
        .stat-card {
          border: 1px solid rgba(0,0,0,0.05);
          transition: transform 0.2s ease;
        }
        .stat-card:hover { transform: translateY(-3px); }

        .booking-alert-card {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
        }

        .icon-box-lg {
          width: 80px; height: 80px;
          background: rgba(255,255,255,0.1);
          border-radius: 24px;
          display: flex; align-items: center; justify-content: center;
          color: #fbbf24; position: relative;
        }

        .notification-badge {
          position: absolute; top: -5px; right: -5px;
          background: #ef4444; color: white;
          width: 28px; height: 28px; border-radius: 50%;
          font-size: 0.8rem; font-weight: bold;
          display: flex; align-items: center; justify-content: center;
          border: 3px solid #1e293b;
        }

        .pulse-warning {
          animation: shadow-pulse 2s infinite;
        }

        @keyframes shadow-pulse {
          0% { box-shadow: 0 0 0 0px rgba(251, 191, 36, 0.4); }
          100% { box-shadow: 0 0 0 20px rgba(251, 191, 36, 0); }
        }

        .status-dot { width: 8px; height: 8px; border-radius: 50%; }
        .pulse-green { background: #10b981; animation: dot-pulse 1.5s infinite; }
        @keyframes dot-pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }

        .action-hub-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .action-hub-card:hover { background-color: #f1f5f9 !important; }
      `}</style>
    </div>
  );
};

/* REUSABLE KPI CARD */
const StatCard = ({ label, value, icon, trend, subText, color }) => (
  <div className="col-6 col-md-3">
    <div className="card h-100 border-0 shadow-sm rounded-4 p-3 stat-card">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className={`p-2 rounded-3 bg-${color}-subtle text-${color}`}>
          {React.cloneElement(icon, { size: 20 })}
        </div>
        {trend && <span className={`badge rounded-pill bg-${color}-subtle text-${color} small`}>{trend}</span>}
      </div>
      <h6 className="text-muted small fw-bold text-uppercase mb-1 tracking-wider">{label}</h6>
      <h3 className="fw-800 mb-0">{value}</h3>
      {subText && <p className="text-muted small mb-0 mt-1">{subText}</p>}
    </div>
  </div>
);

/* REUSABLE HUB COMPONENT */
const ManagementHub = ({ title, icon, accent, stats, actions }) => (
  <div className="col-lg-6">
    <div className="p-4 bg-white rounded-5 shadow-sm border h-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <div className={`p-3 bg-${accent} text-white rounded-4 shadow-sm`}>
            {icon}
          </div>
          <div>
            <h4 className="fw-bold mb-0">{title}</h4>
            <small className="text-muted">{stats}</small>
          </div>
        </div>
      </div>
      <div className="row g-3">
        {actions.map((action, idx) => (
          <div className="col-sm-6" key={idx}>
            <Link to={action.link} className="text-decoration-none text-dark h-100 d-block">
              <div className="card border-0 bg-light rounded-4 h-100 action-hub-card">
                <div className="card-body p-3">
                  <div className={`text-${action.color} mb-2`}>{action.icon}</div>
                  <h6 className="fw-bold mb-1 d-flex align-items-center gap-2">
                    {action.title} <ArrowUpRight size={14} className="opacity-50" />
                  </h6>
                  <p className="text-muted small mb-0">{action.desc}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ProviderDashboard;