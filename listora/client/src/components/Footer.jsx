import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaLinkedinIn,
  FaGithub,
  FaInstagram,
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".footer-column", {
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const gradientText = {
    background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "800",
    letterSpacing: "-0.5px"
  };

  return (
    <footer
      ref={footerRef}
      className="bg-dark text-white-50 position-relative overflow-hidden"
      style={{ paddingTop: "100px", paddingBottom: "40px" }}
    >
      {/* Subtle Background Glow */}
      <div className="position-absolute top-0 start-50 translate-middle-x w-100 h-100" 
           style={{ background: 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 70%)', zIndex: 0 }}></div>

      <style>{`
        .footer-link {
          transition: all 0.3s ease;
          color: rgba(255, 255, 255, 0.6) !important;
          display: inline-block;
        }
        .footer-link:hover {
          color: #fff !important;
          transform: translateX(6px);
        }
        .social-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .social-btn:hover {
          background: #6366f1;
          color: white;
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
          border-color: transparent;
        }
        .newsletter-input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 12px 20px;
          border-radius: 12px;
        }
        .newsletter-input:focus {
          background: rgba(255, 255, 255, 0.1);
          border-color: #6366f1;
          box-shadow: none;
          color: white;
        }
      `}</style>

      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="row gy-5 mb-5">
          
          {/* BRAND COLUMN */}
          <div className="col-lg-4 col-md-12 footer-column">
            <h3 className="mb-4" style={gradientText}>Listora</h3>
            <p className="pe-lg-5 mb-4 leading-relaxed">
              Redefining global hospitality with a unified ecosystem for discovery, 
              secure reservations, and intelligent provider management.
            </p>
            <div className="d-flex gap-2">
              {[
                [FaLinkedinIn, "https://linkedin.com"],
                [FaGithub, "https://github.com"],
                [FaTwitter, "https://twitter.com"],
                [FaInstagram, "https://instagram.com"]
              ].map(([Icon, url], idx) => (
                <a key={idx} href={url} className="social-btn text-decoration-none" target="_blank" rel="noreferrer">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="col-lg-2 col-md-4 col-6 footer-column">
            <h6 className="text-white fw-bold mb-4">Platform</h6>
            <ul className="list-unstyled d-grid gap-3">
              <li><Link to="/hotels" className="footer-link text-decoration-none small">Browse Stays</Link></li>
              <li><Link to="/bookings" className="footer-link text-decoration-none small">My Reservations</Link></li>
              <li><Link to="/analytics" className="footer-link text-decoration-none small">Pricing Insights</Link></li>
              <li><Link to="/support" className="footer-link text-decoration-none small">Help Center</Link></li>
            </ul>
          </div>

          {/* COMPANY */}
          <div className="col-lg-2 col-md-4 col-6 footer-column">
            <h6 className="text-white fw-bold mb-4">Company</h6>
            <ul className="list-unstyled d-grid gap-3">
              <li><Link to="/about" className="footer-link text-decoration-none small">Our Mission</Link></li>
              <li><Link to="/providers" className="footer-link text-decoration-none small">For Hosts</Link></li>
              <li><Link to="/privacy" className="footer-link text-decoration-none small">Privacy Policy</Link></li>
              <li><Link to="/terms" className="footer-link text-decoration-none small">Terms of Service</Link></li>
            </ul>
          </div>

          {/* NEWSLETTER / CONTACT */}
          <div className="col-lg-4 col-md-4 footer-column">
            <h6 className="text-white fw-bold mb-4">Stay in the Loop</h6>
            <p className="small mb-4">Join 5,000+ travelers for exclusive deals and updates.</p>
            <div className="input-group mb-4">
              <input 
                type="email" 
                className="form-control newsletter-input" 
                placeholder="Email Address"
              />
              <button className="btn btn-primary px-3 rounded-end-3">
                <FaArrowRight size={14} />
              </button>
            </div>
            <div className="d-grid gap-2 small">
              <span className="d-flex align-items-center gap-2"><FaPhoneAlt className="text-primary" /> +91 90969 59656</span>
              <span className="d-flex align-items-center gap-2"><FaEnvelope className="text-primary" /> cvvortexgen@gmail.com</span>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-5 border-top border-secondary border-opacity-25 mt-5">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              <p className="small mb-0">
                &copy; {new Date().getFullYear()} Listora Technologies Inc. All Rights Reserved.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <p className="small mb-0">
                Designed & Developed by <span className="text-white fw-bold">Ayush Singh</span> & <span className="text-white fw-bold">Abhishek Singh</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;