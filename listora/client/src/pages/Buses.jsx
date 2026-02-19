import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { 
  BusFront, MapPin, Wind, ShieldCheck, ArrowRight, Search, 
  SlidersHorizontal, XCircle, Navigation, Clock, Zap, Star,
  ShieldAlert, Coffee, Wifi, MonitorPlay
} from "lucide-react";

export default function Buses() {
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [maxPrice, setMaxPrice] = useState(5000);

  useEffect(() => {
    api.get("/buses")
      .then(res => {
        const data = res.data || [];
        setBuses(data);
        setFilteredBuses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching buses:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const result = buses.filter(bus => {
      const matchesType = filterType === "all" ? true : filterType === "ac" ? bus.ac : !bus.ac;
      const matchLocation = (input, loc) => input.length < 2 || (loc || "").toLowerCase().includes(input.toLowerCase());
      const matchesPrice = bus.pricePerSeat <= maxPrice;
      return matchesType && matchesPrice && matchLocation(filterFrom, bus.departure) && matchLocation(filterTo, bus.destination);
    });
    setFilteredBuses(result);
  }, [filterFrom, filterTo, filterType, maxPrice, buses]);

  const resetFilters = () => {
    setFilterFrom(""); setFilterTo(""); setFilterType("all"); setMaxPrice(5000);
  };

  if (loading) {
    return (
      <div className="modern-loader">
        <div className="scanner-container">
          <BusFront size={60} className="loader-bus" />
          <div className="scan-line"></div>
        </div>
        <p className="loader-text">OPTIMIZING ROUTES</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Dynamic Header */}
      <header className="page-header">
        <div className="container">
          <div className="header-content">
            <h1 className="main-title">Premium <span className="text-highlight">Voyages</span></h1>
            <p className="subtitle">Curated intercity travel with executive comforts.</p>
          </div>
        </div>
      </header>

      <main className="container main-content">
        <div className="row g-4">
          
          {/* Advanced Sidebar */}
          <aside className="col-xl-3 col-lg-4">
            <div className="sticky-sidebar">
              <div className="filter-card">
                <div className="filter-header">
                  <div className="d-flex align-items-center gap-2">
                    <SlidersHorizontal size={18} />
                    <span>REFINE SEARCH</span>
                  </div>
                  <button onClick={resetFilters} className="reset-link">Reset All</button>
                </div>

                <div className="filter-body">
                  <div className="search-field">
                    <label>From</label>
                    <div className="input-group-custom">
                      <MapPin size={18} />
                      <input type="text" placeholder="Departure City" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} />
                    </div>
                  </div>

                  <div className="search-field">
                    <label>To</label>
                    <div className="input-group-custom">
                      <Navigation size={18} />
                      <input type="text" placeholder="Destination City" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} />
                    </div>
                  </div>

                  <div className="search-field">
                    <label>Vehicle Class</label>
                    <div className="tab-switcher">
                      {['all', 'ac', 'non-ac'].map(t => (
                        <button key={t} className={filterType === t ? 'active' : ''} onClick={() => setFilterType(t)}>
                          {t.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="search-field">
                    <div className="d-flex justify-content-between mb-2">
                      <label>Max Fare</label>
                      <span className="price-label">₹{maxPrice}</span>
                    </div>
                    <input type="range" className="range-slider" min="300" max="5000" step="100" value={maxPrice} onChange={(e) => setMaxPrice(parseInt(e.target.value))} />
                  </div>
                </div>
              </div>

              <div className="promo-card d-none d-lg-block mt-4">
                <ShieldAlert size={24} />
                <h6>Travel Insurance</h6>
                <p>Add protection to your journey for just ₹15 per passenger.</p>
              </div>
            </div>
          </aside>

          {/* Results Section */}
          <section className="col-xl-9 col-lg-8">
            <div className="results-toolbar">
              <span className="results-count">Showing <strong>{filteredBuses.length}</strong> verified services</span>
            </div>

            {filteredBuses.length === 0 ? (
              <div className="empty-results">
                <XCircle size={64} strokeWidth={1} />
                <h3>No Routes Found</h3>
                <p>Adjust your filters or try searching for a different date.</p>
              </div>
            ) : (
              <div className="bus-stack">
                {filteredBuses.map((bus, idx) => (
                  <div className="bus-ticket" key={bus._id} style={{ '--order': idx }}>
                    <div className="ticket-body">
                      {/* Brand Block */}
                      <div className="brand-block">
                        <div className="brand-icon">
                          <BusFront size={24} />
                        </div>
                        <div className="brand-info">
                          <h4 className="bus-name">{bus.busName}</h4>
                          <div className="bus-type">
                            {bus.ac ? 'Executive AC Sleeper' : 'Premium Non-AC'}
                          </div>
                          <div className="rating">
                            <Star size={12} fill="#fbbf24" stroke="#fbbf24" />
                            <span>4.8</span>
                          </div>
                        </div>
                      </div>

                      {/* Itinerary Block */}
                      <div className="itinerary-block">
                        <div className="time-node">
                          <span className="time">21:30</span>
                          <span className="city">{bus.departure}</span>
                        </div>
                        <div className="path-node">
                          <span className="duration">09h 15m</span>
                          <div className="visual-line">
                            <div className="dot"></div>
                            <div className="line"></div>
                            <div className="dot"></div>
                          </div>
                        </div>
                        <div className="time-node">
                          <span className="time">06:45</span>
                          <span className="city">{bus.destination}</span>
                        </div>
                      </div>

                      {/* Pricing Block */}
                      <div className="pricing-block">
                        <div className="price-wrapper">
                          <span className="label">Fare</span>
                          <h3 className="amount">₹{bus.pricePerSeat}</h3>
                        </div>
                        <div className={`inventory ${bus.availableSeats < 10 ? 'low' : ''}`}>
                          {bus.availableSeats} Seats left
                        </div>
                      </div>
                    </div>

                    <div className="ticket-footer">
                      <div className="amenities-list">
                        <span title="Wifi"><Wifi size={14} /></span>
                        <span title="Charging Port"><Zap size={14} /></span>
                        <span title="Water/Coffee"><Coffee size={14} /></span>
                        <span title="Entertainment"><MonitorPlay size={14} /></span>
                      </div>
                      <Link to={`/buses/${bus._id}`} className="booking-action">
                        Book Now <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <style>{`
        :root {
          --primary: #6366f1;
          --primary-dark: #4f46e5;
          --surface: #ffffff;
          --bg-main: #f8fafc;
          --text-main: #1e293b;
          --text-muted: #64748b;
          --border: #e2e8f0;
          --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }

        .app-container { background: var(--bg-main); min-height: 100vh; padding-bottom: 4rem; }
        
        /* HEADER */
        .page-header { 
          background: #0f172a; 
          padding: 4rem 0 8rem; 
          color: white; 
          clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
        }
        .text-highlight { color: #818cf8; }
        .main-title { font-weight: 800; font-size: 2.5rem; letter-spacing: -0.025em; }
        .subtitle { font-size: 1.1rem; opacity: 0.8; }

        /* MAIN LAYOUT */
        .main-content { margin-top: -5rem; }
        .sticky-sidebar { position: sticky; top: 2rem; }

        /* FILTER CARD */
        .filter-card {
          background: var(--surface);
          border-radius: 1.25rem;
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
          overflow: hidden;
        }
        .filter-header { 
          padding: 1.25rem; border-bottom: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center;
          font-weight: 700; font-size: 0.85rem; color: var(--text-main);
        }
        .reset-link { border: none; background: none; color: var(--primary); font-size: 0.75rem; cursor: pointer; }
        .filter-body { padding: 1.5rem; }
        .search-field { margin-bottom: 1.5rem; }
        .search-field label { display: block; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem; }

        .input-group-custom {
          display: flex; align-items: center; background: #f1f5f9; border-radius: 0.75rem; padding: 0.6rem 1rem;
          border: 1px solid transparent; transition: all 0.2s;
        }
        .input-group-custom:focus-within { border-color: var(--primary); background: white; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }
        .input-group-custom input { border: none; background: transparent; outline: none; width: 100%; font-size: 0.9rem; font-weight: 500; margin-left: 0.75rem; }
        .input-group-custom svg { color: var(--text-muted); }

        .tab-switcher { display: flex; background: #f1f5f9; padding: 0.25rem; border-radius: 0.75rem; }
        .tab-switcher button { 
          flex: 1; border: none; background: none; padding: 0.5rem; font-size: 0.7rem; font-weight: 700;
          border-radius: 0.5rem; color: var(--text-muted); transition: 0.2s;
        }
        .tab-switcher button.active { background: white; color: var(--primary); box-shadow: 0 2px 4px rgba(0,0,0,0.05); }

        /* TICKET DESIGN */
        .bus-stack { display: flex; flex-direction: column; gap: 1.25rem; }
        .bus-ticket {
          background: var(--surface); border-radius: 1.25rem; border: 1px solid var(--border);
          box-shadow: 0 1px 3px rgba(0,0,0,0.05); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: slideUp 0.5s ease forwards; animation-delay: calc(var(--order) * 0.1s); opacity: 0;
        }
        .bus-ticket:hover { transform: translateY(-4px); box-shadow: 0 12px 25px -5px rgba(0,0,0,0.1); border-color: var(--primary); }
        
        .ticket-body { display: grid; grid-template-columns: 1.2fr 2fr 0.8fr; padding: 1.5rem; gap: 1rem; align-items: center; }
        .brand-block { display: flex; gap: 1rem; align-items: center; }
        .brand-icon { width: 48px; height: 48px; background: #eef2ff; color: var(--primary); display: flex; align-items: center; justify-content: center; border-radius: 0.75rem; }
        .bus-name { font-weight: 800; font-size: 1.1rem; margin: 0; }
        .bus-type { font-size: 0.75rem; color: var(--text-muted); }
        .rating { display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; font-weight: 700; margin-top: 0.25rem; }

        .itinerary-block { display: flex; align-items: center; justify-content: space-between; text-align: center; }
        .time-node .time { display: block; font-size: 1.25rem; font-weight: 800; }
        .time-node .city { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }
        
        .path-node { flex-grow: 1; padding: 0 1.5rem; position: relative; }
        .visual-line { display: flex; align-items: center; gap: 0.5rem; }
        .visual-line .line { flex-grow: 1; height: 2px; background: #e2e8f0; border-radius: 2px; }
        .visual-line .dot { width: 6px; height: 6px; background: #cbd5e1; border-radius: 50%; }
        .duration { font-size: 0.65rem; color: var(--text-muted); font-weight: 700; margin-bottom: 0.25rem; display: block; }

        .pricing-block { text-align: right; }
        .price-wrapper .label { font-size: 0.7rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; }
        .price-wrapper .amount { font-weight: 800; color: var(--text-main); font-size: 1.5rem; margin: 0; }
        .inventory { font-size: 0.7rem; font-weight: 700; color: #10b981; }
        .inventory.low { color: #ef4444; }

        .ticket-footer { 
          padding: 0.75rem 1.5rem; background: #f8fafc; border-top: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center; border-radius: 0 0 1.25rem 1.25rem;
        }
        .amenities-list { display: flex; gap: 1rem; color: var(--text-muted); }
        .booking-action {
          background: var(--primary); color: white; padding: 0.6rem 1.25rem; border-radius: 0.75rem;
          font-weight: 700; font-size: 0.85rem; text-decoration: none; display: flex; align-items: center; gap: 0.5rem;
          transition: 0.2s;
        }
        .booking-action:hover { background: var(--primary-dark); transform: translateX(4px); color: white; }

        /* LOADER */
        .modern-loader { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: white; }
        .scanner-container { position: relative; margin-bottom: 1rem; }
        .loader-bus { color: var(--primary); animation: drift 2s infinite alternate ease-in-out; }
        .scan-line { position: absolute; top: 0; width: 2px; height: 60px; background: var(--primary); left: 50%; box-shadow: 0 0 15px var(--primary); animation: scan 1.5s infinite; }
        .loader-text { font-size: 0.7rem; font-weight: 900; letter-spacing: 0.2em; color: var(--text-muted); }

        /* RESPONSIVE */
        @media (max-width: 991px) {
          .ticket-body { grid-template-columns: 1fr 1fr; }
          .pricing-block { grid-column: span 2; display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border); padding-top: 1rem; }
          .page-header { padding: 3rem 0 6rem; }
        }
        @media (max-width: 576px) {
          .ticket-body { display: block; }
          .brand-block { margin-bottom: 1.5rem; }
          .itinerary-block { margin-bottom: 1.5rem; }
          .path-node { padding: 0 0.75rem; }
          .itinerary-block .time { font-size: 1.1rem; }
        }

        @keyframes drift { from { transform: translateX(-10px); } to { transform: translateX(10px); } }
        @keyframes scan { 0% { left: 0%; opacity: 0; } 50% { opacity: 1; } 100% { left: 100%; opacity: 0; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}