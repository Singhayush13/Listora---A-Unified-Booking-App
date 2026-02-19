import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search, MapPin, Star, Coffee, Wifi, 
  ShieldCheck, ChevronRight, SlidersHorizontal, 
  XCircle, Zap, Heart, Info
} from "lucide-react";
import api from "../services/api";

const optimizeImage = (url, width = 800) => {
  if (!url || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/q_auto:best,f_auto,w_${width}/`);
};

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [maxPrice, setMaxPrice] = useState(15000);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    api.get("/hotels")
      .then(res => {
        setHotels(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const processedHotels = useMemo(() => {
    let result = hotels.filter(h => {
      const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          h.address?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch && h.pricePerNight <= maxPrice;
    });

    if (sortBy === "priceLow") result.sort((a, b) => a.pricePerNight - b.pricePerNight);
    if (sortBy === "priceHigh") result.sort((a, b) => b.pricePerNight - a.pricePerNight);
    if (sortBy === "rating") result.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return result;
  }, [hotels, searchTerm, maxPrice, sortBy]);

  const SkeletonCard = () => (
    <div className="col-12 col-sm-6 col-lg-4">
      <div className="card border-0 rounded-4 overflow-hidden shadow-sm h-100">
        <div className="skeleton-img pulse" style={{ height: "240px", background: "#e2e8f0" }}></div>
        <div className="card-body p-4">
          <div className="skeleton-text pulse mb-2" style={{ width: "40%", height: "10px", background: "#e2e8f0" }}></div>
          <div className="skeleton-text pulse mb-3" style={{ width: "80%", height: "20px", background: "#e2e8f0" }}></div>
          <div className="skeleton-text pulse" style={{ width: "60%", height: "15px", background: "#e2e8f0" }}></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-vh-100 pb-5" style={{ backgroundColor: "#fdfdfd" }}>
      {/* ================= MODERN SEARCH HEADER ================= */}
      <div className="bg-white border-bottom sticky-top shadow-sm z-3">
        <div className="container py-3">
          <div className="row g-3 align-items-center">
            {/* Search Input */}
            <div className="col-lg-5">
              <div className="input-group bg-light rounded-pill px-3 py-1 border">
                <Search size={18} className="text-muted mt-2" />
                <input
                  type="text"
                  className="form-control border-0 bg-transparent shadow-none"
                  placeholder="Where are you going?"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Price Range Desktop */}
            <div className="col-lg-4 d-none d-lg-block">
              <div className="px-3">
                <div className="d-flex justify-content-between x-small fw-bold text-muted mb-1">
                  <span>MAX PRICE</span>
                  <span className="text-primary">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="15000"
                  step="500"
                  value={maxPrice}
                  className="form-range custom-range"
                  onChange={e => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="col-lg-3">
              <div className="d-flex gap-2">
                <select
                  className="form-select rounded-pill bg-light border-0 shadow-none fw-medium"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="default">Sort: Recommended</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="rating">Best Rated</option>
                </select>
                {(searchTerm || maxPrice < 15000) && (
                  <button onClick={() => {setSearchTerm(""); setMaxPrice(15000)}} className="btn btn-light rounded-pill border">
                    <XCircle size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="container mt-5">
        <header className="mb-4 d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-extrabold text-dark mb-1">Stays in Selected Area</h2>
            <p className="text-muted small mb-0">Showing {processedHotels.length} unique properties</p>
          </div>
          <div className="d-flex gap-2 d-lg-none">
            <button className="btn btn-outline-dark btn-sm rounded-pill px-3">
              <SlidersHorizontal size={14} className="me-1" /> Filters
            </button>
          </div>
        </header>

        <div className="row g-4">
          {loading ? (
            Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : processedHotels.length > 0 ? (
            processedHotels.map(h => (
              <div className="col-12 col-sm-6 col-lg-4" key={h._id}>
                <div className="card hotel-card border-0 rounded-5 shadow-hover h-100 bg-white">
                  {/* Thumbnail */}
                  <div className="position-relative overflow-hidden rounded-top-5">
                    <img
                      src={optimizeImage(h.images?.[0] || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb")}
                      alt={h.name}
                      className="hotel-img"
                      loading="lazy"
                    />
                    <div className="badge-overlay p-3">
                      <div className="d-flex justify-content-between w-100">
                        {h.rating >= 4.5 ? (
                          <span className="badge-modern">
                            <Zap size={12} fill="currentColor" /> Rare Find
                          </span>
                        ) : <div />}
                        <button className="btn-wishlist">
                          <Heart size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="fw-bold text-dark text-truncate mb-0" style={{ maxWidth: '75%' }}>{h.name}</h5>
                      <div className="d-flex align-items-center gap-1 fw-bold text-dark">
                        <Star size={16} fill="#fbbf24" stroke="#fbbf24" /> {h.rating || "4.5"}
                      </div>
                    </div>

                    <p className="text-muted x-small d-flex align-items-center gap-1 mb-3">
                      <MapPin size={14} /> {h.address || "Main Street, Downtown"}
                    </p>

                    <div className="d-flex flex-wrap gap-2 mb-4">
                      <span className="amenity-tag"><Wifi size={12}/> Wifi</span>
                      <span className="amenity-tag"><Coffee size={12}/> Breakfast</span>
                      <span className="amenity-tag"><ShieldCheck size={12}/> Secure</span>
                    </div>

                    <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                      <div>
                        <span className="fw-extrabold fs-4 text-dark">₹{h.pricePerNight}</span>
                        <span className="text-muted small">/night</span>
                      </div>
                      <Link to={`/hotels/${h._id}`} className="btn-explore">
                        Explore <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <Info size={48} className="text-muted mb-3 opacity-25" />
              <h4 className="fw-bold">No stays found matching your criteria</h4>
              <p className="text-muted">Try adjusting your filters or search term</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .fw-extrabold { font-weight: 800; }
        .x-small { font-size: 0.75rem; }
        
        /* Modern Hotel Card */
        .hotel-card {
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          cursor: pointer;
        }
        .shadow-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
        }

        .hotel-img {
          width: 100%;
          height: 240px;
          object-fit: cover;
          transition: transform 0.8s ease;
        }
        .hotel-card:hover .hotel-img {
          transform: scale(1.1);
        }

        /* Modern Badges & Buttons */
        .badge-modern {
          background: white;
          color: #111827;
          font-weight: 700;
          font-size: 0.7rem;
          padding: 6px 12px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .btn-wishlist {
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(8px);
          border: none;
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }
        .btn-wishlist:hover { background: #ef4444; color: white; }

        .amenity-tag {
          font-size: 0.7rem;
          font-weight: 600;
          padding: 4px 10px;
          background: #f1f5f9;
          color: #475569;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .btn-explore {
          background: #4f46e5;
          color: white;
          font-weight: 700;
          font-size: 0.85rem;
          padding: 8px 18px;
          border-radius: 12px;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: 0.3s;
        }
        .btn-explore:hover { background: #4338ca; transform: translateX(3px); }

        .badge-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 2;
        }

        .custom-range::-webkit-slider-thumb { background: #4f46e5; }
        
        .pulse { animation: pulse-bg 1.5s infinite; }
        @keyframes pulse-bg { 0%{opacity:1} 50%{opacity:0.4} 100%{opacity:1} }
      `}</style>
    </div>
  );
};

export default Hotels;