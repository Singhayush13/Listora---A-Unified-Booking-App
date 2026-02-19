import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  MapPin, Star, Share, Heart, Coffee, Wifi, 
  ShieldCheck, Calendar, Info, MessageSquare, X 
} from "lucide-react";
import api from "../services/api";
import ChatBox from "../components/ChatBox";
import RoomGrid from "../components/RoomGrid";

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    Promise.all([
      api.get(`/hotels/${id}`),
      api.get(`/rooms/${id}`)
    ])
    .then(([hotelRes, roomRes]) => {
      setHotel(hotelRes.data);
      setRooms(roomRes.data);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="spinner-grow text-primary" role="status"></div>
      <p className="mt-3 text-muted fw-medium">Loading property details...</p>
    </div>
  );

  if (!hotel) return <div className="container text-center py-5"><h4>Hotel not found</h4></div>;

  // Calculation Logic
  const today = new Date().toISOString().split("T")[0];
  const nights = checkIn && checkOut ? Math.max((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24), 0) : 0;
  const totalPrice = nights * (hotel.pricePerNight || 0);

  const confirmBooking = async () => {
    try {
      await api.post("/bookings", {
        hotel: hotel._id,
        provider: hotel.provider?._id,
        room: selectedRoom._id,
        fromDate: checkIn,
        toDate: checkOut,
        amountPaid: totalPrice
      });
      setShowBooking(false);
      alert("Booking successful! View it in My Bookings.");
      navigate("/bookings");
    } catch (err) {
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div className="container py-4">
      {/* 1. HEADER SECTION */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">{hotel.name}</h2>
          <div className="d-flex align-items-center gap-3 text-muted small">
            <span className="d-flex align-items-center gap-1"><Star size={16} className="text-warning fill-current"/> 4.8 (120 Reviews)</span>
            <span className="d-flex align-items-center gap-1"><MapPin size={16}/> {hotel.address}</span>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-dark btn-sm rounded-pill px-3 d-flex align-items-center gap-2"><Share size={16}/> Share</button>
          <button className="btn btn-outline-danger btn-sm rounded-pill px-3 d-flex align-items-center gap-2"><Heart size={16}/> Save</button>
        </div>
      </div>

      {/* 2. IMAGE GALLERY (Bento Style) */}
      <div className="row g-2 mb-5 overflow-hidden rounded-4 shadow-sm" style={{ height: "450px" }}>
        <div className="col-md-8 h-100">
          <img src={hotel.images?.[selectedImage]} className="w-100 h-100 object-fit-cover gallery-main" alt="Main" />
        </div>
        <div className="col-md-4 d-flex flex-column gap-2 h-100">
          {hotel.images?.slice(1, 4).map((img, idx) => (
            <div key={idx} className="h-50 overflow-hidden">
              <img src={img} className="w-100 h-100 object-fit-cover gallery-sub" alt="Sub" onClick={() => setSelectedImage(idx + 1)} />
            </div>
          ))}
        </div>
      </div>

      <div className="row g-5">
        {/* LEFT COLUMN: DETAILS */}
        <div className="col-lg-8">
          <div className="mb-5">
            <h4 className="fw-bold mb-3">About this property</h4>
            <p className="text-secondary leading-relaxed">{hotel.description || "Experience unmatched comfort and world-class service at this premier location. Perfect for both business and leisure travelers."}</p>
            
            <div className="row g-4 mt-2">
              <div className="col-md-4 d-flex align-items-start gap-3">
                <div className="p-2 bg-light rounded-3 text-primary"><Wifi size={24}/></div>
                <div><span className="d-block fw-bold">Free Wifi</span><small className="text-muted">High speed fiber</small></div>
              </div>
              <div className="col-md-4 d-flex align-items-start gap-3">
                <div className="p-2 bg-light rounded-3 text-primary"><Coffee size={24}/></div>
                <div><span className="d-block fw-bold">Breakfast</span><small className="text-muted">Complimentary daily</small></div>
              </div>
              <div className="col-md-4 d-flex align-items-start gap-3">
                <div className="p-2 bg-light rounded-3 text-primary"><ShieldCheck size={24}/></div>
                <div><span className="d-block fw-bold">Security</span><small className="text-muted">24/7 Monitored</small></div>
              </div>
            </div>
          </div>

          <hr className="my-5 opacity-10" />

          {/* ROOM SELECTION */}
          <div className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">Select Your Room</h4>
              <div className="d-flex gap-3 small">
                <span className="badge bg-success-subtle text-success px-2 py-1">Available</span>
                <span className="badge bg-danger-subtle text-danger px-2 py-1">Occupied</span>
              </div>
            </div>
            <div className="p-4 bg-white border rounded-4 shadow-sm">
              <RoomGrid
                rooms={rooms}
                selectedRoom={selectedRoom?._id}
                onSelect={setSelectedRoom}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STICKY BOOKING */}
        <div className="col-lg-4">
          <div className="sticky-top" style={{ top: "2rem", zIndex: 10 }}>
            <div className="card border-0 shadow-lg rounded-4 p-4 overflow-hidden">
              <div className="d-flex justify-content-between align-items-end mb-4">
                <div>
                  <span className="h3 fw-bold">₹{hotel.pricePerNight}</span>
                  <span className="text-muted"> / night</span>
                </div>
                <div className="text-primary small fw-medium">Best Price Guarantee</div>
              </div>

              <div className="border rounded-3 mb-4 overflow-hidden">
                <div className="row g-0">
                  <div className="col-6 border-end border-bottom p-3">
                    <label className="d-block small text-uppercase fw-bold text-muted mb-1" style={{ fontSize: '10px' }}>Check-in</label>
                    <input type="date" className="form-control border-0 p-0 shadow-none" min={today} value={checkIn} onChange={e => setCheckIn(e.target.value)} />
                  </div>
                  <div className="col-6 border-bottom p-3">
                    <label className="d-block small text-uppercase fw-bold text-muted mb-1" style={{ fontSize: '10px' }}>Check-out</label>
                    <input type="date" className="form-control border-0 p-0 shadow-none" min={checkIn || today} value={checkOut} onChange={e => setCheckOut(e.target.value)} />
                  </div>
                </div>
                <div className="p-3">
                  <label className="d-block small text-uppercase fw-bold text-muted mb-1" style={{ fontSize: '10px' }}>Selected Room</label>
                  <div className="text-dark fw-medium">{selectedRoom ? `Room ${selectedRoom.roomNumber}` : "Select a room above"}</div>
                </div>
              </div>

              <button 
                className="btn btn-primary w-100 py-3 rounded-3 fw-bold mb-3 shadow-sm"
                disabled={!selectedRoom || !checkIn || !checkOut}
                onClick={() => setShowBooking(true)}
              >
                Reserve Now
              </button>

              <button 
                onClick={() => setShowChat(true)}
                className="btn btn-light w-100 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2 border"
              >
                <MessageSquare size={18}/> Contact Host
              </button>

              {nights > 0 && (
                <div className="mt-4 pt-4 border-top">
                  <div className="d-flex justify-content-between text-muted mb-2">
                    <span>₹{hotel.pricePerNight} x {nights} nights</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="d-flex justify-content-between text-muted mb-2">
                    <span>Service Fee</span>
                    <span>₹0</span>
                  </div>
                  <div className="d-flex justify-content-between fw-bold h5 mt-3 pt-2 text-dark">
                    <span>Total</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-4 text-center">
              <div className="p-3 bg-light rounded-4 d-flex align-items-center gap-3 justify-content-center">
                <Info size={18} className="text-muted"/>
                <span className="small text-muted">You won't be charged yet</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOOKING MODAL */}
      {showBooking && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header-custom border-bottom pb-3 mb-3 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold m-0">Review Your Stay</h5>
              <X className="cursor-pointer" onClick={() => setShowBooking(false)} />
            </div>
            <div className="modal-body py-2">
              <div className="d-flex gap-3 mb-4">
                <img src={hotel.images?.[0]} className="rounded-3" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                <div>
                  <h6 className="fw-bold mb-1">{hotel.name}</h6>
                  <p className="small text-muted mb-0">{selectedRoom?.roomNumber}</p>
                  <p className="small fw-bold text-primary">{checkIn} → {checkOut}</p>
                </div>
              </div>
              <div className="h4 text-center fw-bold py-3 bg-light rounded-3">Total: ₹{totalPrice}</div>
            </div>
            <button className="btn btn-success w-100 py-3 mt-3 rounded-pill fw-bold" onClick={confirmBooking}>
              Confirm Booking
            </button>
          </div>
        </div>
      )}

      {showChat && (
        <ChatBox
          hotelId={hotel._id}
          receiverId={hotel.provider?._id}
          onClose={() => setShowChat(false)}
        />
      )}

      <style>{`
        .gallery-main, .gallery-sub { cursor: pointer; transition: transform 0.4s ease; }
        .gallery-main:hover, .gallery-sub:hover { transform: scale(1.02); }
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.4); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; z-index: 9999;
        }
        .modal-card {
          background: white; padding: 2rem; border-radius: 24px;
          width: 100%; max-width: 450px; box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        .bg-success-subtle { background: #d1fae5; }
        .bg-danger-subtle { background: #fee2e2; }
        .cursor-pointer { cursor: pointer; }
        .leading-relaxed { line-height: 1.8; }
      `}</style>
    </div>
  );
}