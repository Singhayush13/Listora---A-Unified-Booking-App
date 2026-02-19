import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, MapPin, Clock, ShieldCheck } from "lucide-react";
import api from "../services/api";

import SeatGrid from "../components/SeatGrid";

export default function BusDetails() {
  const { id } = useParams();
  const [bus, setBus] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [journeyDate, setJourneyDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [busRes, seatsRes] = await Promise.all([
          api.get(`/buses/${id}`),
          api.get(`/seats/bus/${id}`)
        ]);
        setBus(busRes.data);
        setSeats(seatsRes.data);
      } catch (err) {
        console.error("Error fetching bus data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const confirmBooking = async () => {
    if (!selectedSeat || !journeyDate) {
      alert("Please select a seat and date");
      return;
    }
    try {
      setBookingLoading(true);
      await api.post("/bookings/bus", {
        bus: bus._id,
        provider: bus.provider,
        seat: selectedSeat._id,
        amountPaid: bus.pricePerSeat,
        fromDate: journeyDate
      });
      alert("Booking request sent successfully!");
      setSelectedSeat(null);
      const res = await api.get(`/seats/bus/${id}`);
      setSeats(res.data);
    } catch (err) {
      alert("Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="spinner-grow text-primary mb-3" />
      <span className="text-muted fw-bold">Loading your journey...</span>
    </div>
  );

  if (!bus) return <h4 className="text-center mt-5 text-danger">Bus not found</h4>;

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* LEFT COLUMN: BUS INFO & SEATS */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
            <div className="card-header bg-primary text-white p-4 border-0">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h2 className="mb-1 fw-bold">{bus.busName}</h2>
                  <div className="d-flex gap-2 align-items-center opacity-75">
                    <MapPin size={16} />
                    <span>{bus.departure} → {bus.destination}</span>
                  </div>
                </div>
                <div className="badge bg-white text-primary p-2 px-3 rounded-pill shadow-sm">
                  {bus.ac ? "Premium AC" : "Non-AC"}
                </div>
              </div>
            </div>
            
            <div className="card-body p-4">
              <div className="row text-center g-3">
                <div className="col-4 border-end">
                  <div className="text-muted small text-uppercase">Departure</div>
                  <div className="fw-bold h5 mb-0"><Clock size={16} className="me-1 text-primary"/>{bus.departureTime}</div>
                </div>
                <div className="col-4 border-end">
                  <div className="text-muted small text-uppercase">Arrival</div>
                  <div className="fw-bold h5 mb-0">{bus.arrivalTime}</div>
                </div>
                <div className="col-4">
                  <div className="text-muted small text-uppercase">Fare</div>
                  <div className="fw-bold h5 mb-0 text-success">₹{bus.pricePerSeat}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-3">
            <h5 className="fw-bold text-dark">Select Your Seat</h5>
            <div className="d-flex justify-content-center gap-4 mt-2 small text-muted">
              <span><span className="badge bg-white border border-success text-success me-1">○</span> Available</span>
              <span><span className="badge bg-secondary me-1">●</span> Booked</span>
              <span><span className="badge bg-primary me-1">●</span> Selected</span>
            </div>
          </div>

          <SeatGrid seats={seats} selectedSeat={selectedSeat} onSelect={setSelectedSeat} />
        </div>

        {/* RIGHT COLUMN: BOOKING PANEL */}
        <div className="col-lg-4">
          <div className="card border-0 shadow rounded-4 sticky-top" style={{ top: '20px' }}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Journey Details</h5>
              
              <label className="form-label small fw-bold text-muted">CHOOSE DATE</label>
              <div className="input-group mb-4">
                <span className="input-group-text bg-white border-end-0"><Calendar size={18}/></span>
                <input
                  type="date"
                  className="form-control border-start-0 ps-0"
                  value={journeyDate}
                  onChange={e => setJourneyDate(e.target.value)}
                />
              </div>

              {selectedSeat ? (
                <div className="bg-light p-3 rounded-3 mb-4 animate__animated animate__fadeIn">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Selected Seat:</span>
                    <span className="fw-bold text-primary">{selectedSeat.seatNumber}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Base Fare:</span>
                    <span className="fw-bold">₹{bus.pricePerSeat}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between h5 mb-0">
                    <span className="fw-bold">Total:</span>
                    <span className="fw-bold text-success">₹{bus.pricePerSeat}</span>
                  </div>
                </div>
              ) : (
                <div className="alert alert-warning py-2 small border-0 text-center mb-4">
                  Please select a seat to continue
                </div>
              )}

              <button
                className={`btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm ${(!selectedSeat || !journeyDate) ? 'opacity-50' : ''}`}
                disabled={!selectedSeat || !journeyDate || bookingLoading}
                onClick={confirmBooking}
              >
                {bookingLoading ? (
                  <><span className="spinner-border spinner-border-sm me-2"/> Processing...</>
                ) : (
                  "BOOK NOW"
                )}
              </button>

              <div className="mt-4 p-3 bg-light rounded-3 d-flex align-items-center gap-3">
                <ShieldCheck className="text-success" size={24} />
                <span className="small text-muted">Secure transaction protected by 256-bit encryption.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}