import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { gsap } from "gsap";
import { 
  FaUserCircle, FaSignOutAlt, FaSuitcase, 
  FaUserShield, FaChevronDown, FaBars, FaTimes, FaHotel 
} from "react-icons/fa";
import MessagesMenu from "./MessagesMenu";

const brandGradient = "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)";

const navLinkStyle = ({ isActive }) => ({
  color: isActive ? "#6366f1" : "#475569",
  fontWeight: isActive ? 700 : 500,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
});

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navRef = useRef(null);
  const [shrink, setShrink] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "expo.out" }
    );
  }, []);

  useEffect(() => {
    const onScroll = () => setShrink(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "U";

  return (
    <>
      <style>{`
        /* Matching Global Background */
        body {
          background-color: #f8fafc;
          background-image: 
            radial-gradient(at 0% 0%, rgba(14, 165, 233, 0.03) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(99, 102, 241, 0.03) 0px, transparent 50%);
          background-attachment: fixed;
        }

        .navbar-custom {
          backdrop-filter: saturate(180%) blur(20px);
          -webkit-backdrop-filter: saturate(180%) blur(20px);
          background-color: rgba(255, 255, 255, 0.8);
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          z-index: 5000;
        }

        /* Sidebar / Mobile Menu */
        .mobile-sidebar {
          position: fixed;
          top: 0;
          left: ${isMobileMenuOpen ? "0" : "-100%"};
          width: 280px;
          height: 100vh;
          background: white;
          z-index: 2000;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 20px 0 50px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          padding: 2rem;
        }

        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          z-index: 1999;
          display: ${isMobileMenuOpen ? "block" : "none"};
          transition: opacity 0.3s ease;
        }

        .nav-link-item {
          position: relative;
          padding: 8px 16px;
          border-radius: 8px;
        }

        .active-pill {
          background: rgba(99, 102, 241, 0.08);
          border-radius: 8px;
        }

        .login-btn-premium {
          background: ${brandGradient};
          border: none;
          padding: 10px 28px;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);
          transition: all 0.3s ease;
        }

        .user-dropdown-btn {
          background: white;
          border: 1px solid #f1f5f9;
          padding: 5px 12px 5px 6px;
          border-radius: 50px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }

        .dropdown-menu-premium {
          border: none;
          border-radius: 16px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.15);
          padding: 12px;
          min-width: 220px;
        }

        .brand-logo {
          font-size: 1.6rem;
          font-weight: 800;
          letter-spacing: -1px;
          background: ${brandGradient};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-decoration: none;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 12px;
          color: #475569;
          text-decoration: none;
          font-weight: 600;
          border-radius: 10px;
          transition: 0.2s;
        }

        .sidebar-link:hover, .sidebar-link.active {
          background: rgba(99, 102, 241, 0.1);
          color: #6366f1;
        }
      `}</style>

      {/* MOBILE SIDEBAR */}
      <div className="sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)} />
      <div className="mobile-sidebar">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <span className="brand-logo">Listora</span>
          <FaTimes size={24} className="text-muted" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
        
        <div className="d-flex flex-column gap-2">
          <NavLink to="/hotels" className="sidebar-link" onClick={() => setIsMobileMenuOpen(false)}>
            <FaHotel /> Hotels
          </NavLink>
          <NavLink to="/buses" className="sidebar-link" onClick={() => setIsMobileMenuOpen(false)}>
            🚌 Bus Booking
          </NavLink>

          {user && (
            <NavLink to="/bookings" className="sidebar-link" onClick={() => setIsMobileMenuOpen(false)}>
              <FaSuitcase /> My Bookings
            </NavLink>
          )}
          {user?.role === "PROVIDER" && (
            <NavLink to="/provider" className="sidebar-link" onClick={() => setIsMobileMenuOpen(false)}>
              <FaUserShield /> Host Dashboard
            </NavLink>
          )}
          {user?.role === "ADMIN" && (
            <NavLink to="/admin" className="sidebar-link" onClick={() => setIsMobileMenuOpen(false)}>
              <FaUserShield /> Admin Panel
            </NavLink>
          )}
        </div>

        <div className="mt-auto">
          {user ? (
            <button className="btn text-danger w-100 text-start sidebar-link border-0 bg-transparent" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          ) : (
            <Link to="/login" className="login-btn-premium text-center d-block text-decoration-none" onClick={() => setIsMobileMenuOpen(false)}>
              Login
            </Link>
          )}
        </div>
      </div>

      {/* NAVBAR */}
      <nav
        ref={navRef}
        className={`navbar navbar-expand-lg fixed-top navbar-custom ${shrink ? "py-2" : "py-3"}`}
        style={{
          boxShadow: shrink ? "0 10px 30px rgba(0,0,0,0.08)" : "none",
          borderBottom: "1px solid rgba(226, 232, 240, 0.5)"
        }}
      >
        <div className="container">
          {/* MOBILE TOGGLE (LEFT) */}
          <button
            className="btn d-lg-none p-0 me-3 border-0"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <FaBars size={22} color="#6366f1" />
          </button>

          <Link to="/" className="navbar-brand brand-logo">
            Listora
          </Link>

          {/* DESKTOP CENTER LINKS */}
          <div className="collapse navbar-collapse" id="listoraNavbar">
            <ul className="navbar-nav mx-auto gap-1">
              <li className="nav-item">
                <NavLink
                  to="/buses"
                  className={({ isActive }) =>
                    `nav-link nav-link-item ${isActive ? "active-pill" : ""}`
                  }
                  style={navLinkStyle}
                >
                  Buses
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/hotels" className={({ isActive }) => `nav-link nav-link-item ${isActive ? "active-pill" : ""}`} style={navLinkStyle}>
                  Hotels
                </NavLink>
              </li>
              {user && (
                <li className="nav-item">
                  <NavLink to="/bookings" className={({ isActive }) => `nav-link nav-link-item ${isActive ? "active-pill" : ""}`} style={navLinkStyle}>
                    My Bookings
                  </NavLink>
                </li>
              )}
              {user?.role === "PROVIDER" && (
                <li className="nav-item">
                  <NavLink to="/provider" className={({ isActive }) => `nav-link nav-link-item ${isActive ? "active-pill" : ""}`} style={navLinkStyle}>
                    Host Dashboard
                  </NavLink>
                </li>
              )}
              {user?.role === "ADMIN" && (
                <li className="nav-item">
                  <NavLink to="/admin" className={({ isActive }) => `nav-link nav-link-item ${isActive ? "active-pill" : ""}`} style={navLinkStyle}>
                    <FaUserShield className="me-1 mb-1" /> Control Center
                  </NavLink>
                </li>
              )}
            </ul>
          </div>

          {/* RIGHT SIDE ACTIONS */}
          <div className="d-flex align-items-center gap-2 gap-md-4">
            {user && <MessagesMenu />}

            {!user ? (
              <Link to="/login" className="login-btn-premium text-decoration-none d-none d-sm-block">
                Login
              </Link>
            ) : (
              <div className="dropdown">
                <button
                  className="btn d-flex align-items-center gap-2 user-dropdown-btn"
                  data-bs-toggle="dropdown"
                >
                  <div style={{ padding: '2px', background: brandGradient, borderRadius: '50%' }}>
                    <div style={{
                      width: "30px", height: "30px", borderRadius: "50%", 
                      background: "white", color: "#6366f1", 
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.75rem", fontWeight: "bold"
                    }}>
                      {initials}
                    </div>
                  </div>
                  <FaChevronDown size={10} className="text-muted d-none d-md-inline" />
                </button>

                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-premium border-0 shadow-lg">
                  <div className="px-3 py-2 mb-2 border-bottom">
                    <p className="small text-muted mb-0">Account</p>
                    <p className="fw-bold text-dark mb-0 small">{user.name}</p>
                  </div>
                  <li><Link className="dropdown-item py-2" to="/profile"><FaUserCircle className="me-2 text-primary" /> Profile</Link></li>
                  <li><Link className="dropdown-item py-2" to="/bookings"><FaSuitcase className="me-2 text-primary" /> Trips</Link></li>
                  <li><hr className="dropdown-divider opacity-50" /></li>
                  <li>
                    <button className="dropdown-item text-danger py-2 w-100 border-0 bg-transparent text-start" onClick={handleLogout}>
                      <FaSignOutAlt className="me-2" /> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;