import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiMapPin, FiCoffee, FiTrash2, FiEdit3, FiInbox } from "react-icons/fi"; // Lucide/Feather icons
import api from "../../services/api";

const MyHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await api.get("/hotels/provider/my");
      setHotels(res.data);
    } catch (err) {
      console.error("Error fetching hotels", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteHotel = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await api.delete(`/hotels/${id}`);
      setHotels((prev) => prev.filter((h) => h._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // --- SUB-COMPONENTS ---
  
  const SkeletonCard = () => (
    <div className="col-xl-4 col-lg-6 mb-4">
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ height: "400px" }}>
        <div className="bg-light w-100 h-50 animate-pulse" style={{ background: '#eee' }}></div>
        <div className="card-body p-4">
          <div className="bg-light rounded w-75 mb-3 py-3"></div>
          <div className="bg-light rounded w-50 py-2"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid px-lg-5 py-5" style={{ backgroundColor: "#fbfcfd", minHeight: "100vh" }}>
      
      {/* HEADER SECTION */}
      <div className="row align-items-end mb-5">
        <div className="col">
          <span className="text-primary fw-bold text-uppercase small ls-wide">Dashboard</span>
          <h1 className="display-6 fw-bold text-dark mt-1">My Hotel Properties</h1>
          <p className="text-secondary">You have <span className="fw-semibold text-dark">{hotels.length} properties</span> listed.</p>
        </div>
        <div className="col-auto">
          <button
            className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2"
            onClick={() => navigate("/provider/hotels/add")}
            style={{ borderRadius: "12px", fontWeight: "600", boxShadow: "0 4px 14px 0 rgba(0,118,255,0.39)" }}
          >
            <FiPlus /> Add New Property
          </button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="row g-4">
        {loading ? (
          [1, 2, 3].map((n) => <SkeletonCard key={n} />)
        ) : hotels.length === 0 ? (
          <div className="col-12 text-center py-5">
            <div className="p-5 rounded-5 border-0 shadow-sm bg-white mx-auto" style={{ maxWidth: "500px" }}>
              <FiInbox size={48} className="text-muted mb-3" />
              <h3 className="fw-bold">No properties found</h3>
              <p className="text-muted">It looks like you haven't listed any hotels yet. Get started by adding your first property.</p>
              <button className="btn btn-outline-primary mt-2" onClick={() => navigate("/provider/hotels/add")}>
                Create Listing
              </button>
            </div>
          </div>
        ) : (
          hotels.map((h) => (
            <div key={h._id} className="col-xl-4 col-lg-6">
              <div className="card border-0 rounded-4 overflow-hidden h-100 shadow-hover transition-all">
                
                {/* IMAGE COMPONENT */}
                <div className="position-relative overflow-hidden" style={{ height: "240px" }}>
                  <img
                    src={h.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"}
                    alt={h.name}
                    className="w-100 h-100 object-fit-cover"
                  />
                  <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-gradient-dark">
                    <span className="badge glass-badge">₹{h.pricePerNight} <small>/ night</small></span>
                  </div>
                </div>

                {/* DETAILS COMPONENT */}
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title fw-bold mb-0 text-truncate">{h.name}</h5>
                    <div className="d-flex gap-1">
                      {h.foodAvailable && <span className="badge bg-soft-success text-success p-2 rounded-circle"><FiCoffee size={14}/></span>}
                    </div>
                  </div>

                  <p className="text-muted small d-flex align-items-center gap-1 mb-4">
                    <FiMapPin size={14} /> {h.address || "Location not set"}
                  </p>

                  <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-auto">
                    <div className="small text-secondary fw-medium">
                      <span className="text-dark fw-bold">{h.rooms || 0}</span> Rooms Available
                    </div>
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-light-action" 
                        title="Edit Property"
                        onClick={() => navigate(`/provider/hotels/edit/${h._id}`)}
                      >
                        <FiEdit3 size={18} />
                      </button>
                      <button 
                        className="btn btn-light-danger" 
                        title="Delete Property"
                        onClick={() => deleteHotel(h._id)}
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CUSTOM CSS STYLES */}
      <style>{`
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .shadow-hover:hover { 
          transform: translateY(-8px); 
          box-shadow: 0 20px 40px rgba(0,0,0,0.12) !important; 
        }
        .bg-gradient-dark {
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
        }
        .glass-badge {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 8px 14px;
          border-radius: 10px;
          font-weight: 600;
        }
        .bg-soft-success { background-color: #e6f7f0; }
        .btn-light-action {
          border: none;
          background: #f3f4f6;
          color: #4b5563;
          padding: 10px;
          border-radius: 10px;
          transition: 0.2s;
        }
        .btn-light-action:hover { background: #e5e7eb; color: #2563eb; }
        .btn-light-danger {
          border: none;
          background: #fef2f2;
          color: #dc2626;
          padding: 10px;
          border-radius: 10px;
          transition: 0.2s;
        }
        .btn-light-danger:hover { background: #fee2e2; color: #991b1b; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
        .ls-wide { letter-spacing: 0.05em; }
      `}</style>
    </div>
  );
};

export default MyHotels;