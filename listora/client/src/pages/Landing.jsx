import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Star, Check, Shield, Zap, Globe, TrendingUp,
  Users, Clock, ChevronLeft, ChevronRight, ArrowRight,
  MousePointer2, ShieldCheck, Map, CreditCard
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const REVIEWS = [
  { name: "Sarah Mitchell", role: "Travel Enthusiast", initials: "SM", rating: 5, text: "Listora completely changed how I book hotels. Everything is transparent, fast, and beautifully designed." },
  { name: "James Chen", role: "Business Traveler", initials: "JC", rating: 5, text: "Weekly travel used to be painful. With Listora, bookings and invoices are all in one place." },
  { name: "Maria Rodriguez", role: "Hotel Owner", initials: "MR", rating: 5, text: "Our bookings increased by 300%. The analytics and pricing insights are incredibly powerful." }
];

export default function EnhancedLanding() {
  const containerRef = useRef(null);
  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Hero Entrance
      gsap.timeline()
        .from(".hero-title", { y: 60, opacity: 0, duration: 1, ease: "power4.out" })
        .from(".hero-sub", { y: 30, opacity: 0, duration: 1, ease: "power4.out" }, "-=0.6")
        .from(".hero-btns", { y: 20, opacity: 0, duration: 1, ease: "power4.out" }, "-=0.8");

      // Parallax Blobs
      gsap.to(".blob-1", { y: 100, x: 50, duration: 10, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".blob-2", { y: -80, x: -30, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut" });

      // Scroll Reveal
      const items = gsap.utils.toArray(".reveal-on-scroll");
      items.forEach((item) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
            toggleActions: "play none none reverse"
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out"
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const changeReview = (direction) => {
    gsap.to(".review-card", {
      opacity: 0,
      scale: 0.95,
      duration: 0.2,
      onComplete: () => {
        setCurrentReview((prev) => 
          direction === "next" ? (prev + 1) % REVIEWS.length : (prev - 1 + REVIEWS.length) % REVIEWS.length
        );
        gsap.to(".review-card", { opacity: 1, scale: 1, duration: 0.4 });
      }
    });
  };

  return (
    <div ref={containerRef} className="bg-white text-dark overflow-hidden">
      <style>{`
        :root {
          --brand-primary: #6366f1;
          --brand-secondary: #0ea5e9;
          --bg-soft: #f8fafc;
        }

        /* Smooth Typography Scaling */
        h1 { font-size: clamp(2.5rem, 8vw, 4.5rem); }
        h2 { font-size: clamp(2rem, 5vw, 3.2rem); }

        .text-gradient {
          background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .glass-panel {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 20px 40px rgba(0,0,0,0.05);
        }

        .feature-card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 1px solid #f1f5f9;
        }

        .feature-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 30px 60px -12px rgba(99, 102, 241, 0.15);
          border-color: var(--brand-primary);
        }

        .blob {
          position: absolute;
          filter: blur(70px);
          z-index: 0;
          opacity: 0.3;
          border-radius: 50%;
        }

        .nav-link-custom {
          font-weight: 500;
          color: #64748b;
          transition: color 0.3s;
        }
        .nav-link-custom:hover { color: var(--brand-primary); }

        @media (max-width: 768px) {
          .mobile-center { text-align: center !important; }
        }
      `}</style>

      {/* --- HERO SECTION --- */}
      <section className="position-relative min-vh-100 d-flex align-items-center py-5">
        <div className="blob blob-1 bg-primary" style={{ width: '500px', height: '500px', top: '-10%', right: '-5%' }}></div>
        <div className="blob blob-2 bg-info" style={{ width: '400px', height: '400px', bottom: '5%', left: '-5%' }}></div>

        <div className="container position-relative z-1">
          <div className="row align-items-center">
            <div className="col-lg-7 mobile-center">
              <div className="badge rounded-pill bg-light text-primary border px-3 py-2 mb-4 shadow-sm reveal-on-scroll">
                <Zap size={14} className="me-2" /> Next-Gen Travel Infrastructure
              </div>
              <h1 className="hero-title fw-bold mb-4 tracking-tight">
                Global Booking <br />
                <span className="text-gradient">Without Friction.</span>
              </h1>
              <p className="hero-sub lead text-muted mb-5 pe-lg-5">
                Listora empowers travelers and hosts with a unified MERN-powered ecosystem. Secure, incredibly fast, and designed for the modern world.
              </p>
              
              <div className="hero-btns d-flex flex-wrap gap-3 mobile-center justify-content-center justify-content-lg-start">
                <Link to="/hotels" className="btn btn-primary btn-lg px-4 py-3 rounded-4 shadow-lg border-0 d-flex align-items-center gap-2">
                  Get Started <ArrowRight size={20} />
                </Link>
                <button className="btn btn-outline-dark btn-lg px-4 py-3 rounded-4 d-flex align-items-center gap-2">
                  View Ecosystem
                </button>
              </div>

              <div className="mt-5 d-flex gap-4 flex-wrap justify-content-center justify-content-lg-start opacity-75 small fw-medium">
                <span className="d-flex align-items-center gap-1"><ShieldCheck size={18} className="text-success" /> PCI DSS Compliant</span>
                <span className="d-flex align-items-center gap-1"><Globe size={18} className="text-primary" /> 190+ Countries</span>
              </div>
            </div>
            
            <div className="col-lg-5 d-none d-lg-block">
               <div className="glass-panel p-2 rounded-5 rotate-3 shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" className="img-fluid rounded-5" alt="Luxury Travel" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CORE CAPABILITIES --- */}
      <section className="py-5 bg-light">
        <div className="container py-5">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-8">
              <h2 className="fw-bold mb-3">Engineered for Reliability</h2>
              <p className="text-muted lead">The most complete toolset for modern hospitality management.</p>
            </div>
          </div>
          
          <div className="row g-4">
            {[
              { icon: Shield, title: "Enterprise Security", desc: "End-to-end encryption for every transaction and user interaction." },
              { icon: Zap, title: "Sub-Second Latency", desc: "Optimized MongoDB aggregation ensures instant search results." },
              { icon: TrendingUp, title: "Smart Analytics", desc: "AI-driven demand forecasting for both travelers and owners." },
              { icon: Map, title: "Deep Discovery", desc: "Hyper-local maps with points of interest and transport data." },
              { icon: CreditCard, title: "Unified Payments", desc: "Multi-currency support with automated tax and invoice handling." },
              { icon: Users, title: "Concierge 2.0", desc: "24/7 automated support with human escalation available." }
            ].map((f, i) => (
              <div key={i} className="col-md-6 col-lg-4 reveal-on-scroll">
                <div className="feature-card h-100 p-4 bg-white rounded-4">
                  <div className="mb-4 d-inline-flex align-items-center justify-content-center p-3 rounded-4 bg-soft-primary" style={{ backgroundColor: '#f0f4ff' }}>
                    <f.icon size={24} className="text-primary" />
                  </div>
                  <h5 className="fw-bold mb-3">{f.title}</h5>
                  <p className="text-muted mb-0 small leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- LEADERSHIP (PRO) --- */}
      <section className="py-5 bg-white">
        <div className="container py-5">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6">
              <span className="text-primary fw-bold text-uppercase tracking-widest small">The Architects</span>
              <h2 className="fw-bold mt-2">Driven by BSc-IT Rigor</h2>
            </div>
            <div className="col-lg-6">
              <p className="text-muted mb-0">Listora was founded by Ayush and Abhishek Singh with a clear mission: to solve the fragmentation in travel tech using high-performance engineering.</p>
            </div>
          </div>

          <div className="row g-4">
            {[
              { 
                name: "Ayush Singh", 
                role: "Founder & Chief Architect", 
                color: "indigo",
                img: "https://ui-avatars.com/api/?name=Ayush+Singh&background=6366f1&color=fff&size=200"
              },
              { 
                name: "Abhishek Singh", 
                role: "Co-Founder & Strategy Lead", 
                color: "info",
                img: "https://ui-avatars.com/api/?name=Abhishek+Singh&background=0ea5e9&color=fff&size=200"
              }
            ].map((leader, i) => (
              <div key={i} className="col-lg-6 reveal-on-scroll">
                <div className="glass-panel p-4 p-md-5 rounded-5 overflow-hidden">
                  <div className="d-flex align-items-center gap-4 flex-wrap flex-md-nowrap">
                    <img src={leader.img} className="rounded-circle shadow-lg" width="120" alt={leader.name} />
                    <div>
                      <h4 className="fw-bold mb-1">{leader.name}</h4>
                      <p className={`text-${leader.color} fw-medium mb-3`}>{leader.role}</p>
                      <p className="text-muted small mb-0">Focusing on full-stack scalability and user-centric architecture to redefine the booking experience.</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PROFESSIONAL CTA --- */}
      <section className="py-5">
        <div className="container py-5">
          <div className="bg-dark rounded-5 p-5 text-center text-white position-relative overflow-hidden reveal-on-scroll">
            <div className="position-relative z-1 py-4">
              <h2 className="display-5 fw-bold mb-4">Ready to upgrade your journey?</h2>
              <p className="lead opacity-75 mb-5 mx-auto" style={{ maxWidth: '600px' }}>
                Join over 10,000 users experiencing the future of global travel management.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <button className="btn btn-primary btn-lg px-5 py-3 rounded-4 border-0 fw-bold">Create Free Account</button>
                <button className="btn btn-outline-light btn-lg px-5 py-3 rounded-4 fw-bold">Contact Sales</button>
              </div>
            </div>
            <div className="position-absolute top-0 start-0 w-100 h-100" 
                 style={{ background: 'radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)' }}></div>
          </div>
        </div>
      </section>
    </div>
  );
}