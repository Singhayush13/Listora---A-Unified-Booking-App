import React from "react";
import { Armchair, Disc, Info } from "lucide-react"; 
// 'Disc' or 'Circle' works great as a steering wheel placeholder

export default function SeatGrid({ seats, selectedSeat, onSelect }) {
  // Helper to identify sleeper seats
  const isSleeper = (seat) => seat.type === "SLEEPER" || seat.seatNumber.includes('S');

  const getSeatStyles = (seat) => {
    const isSelected = selectedSeat?._id === seat._id;
    if (seat.status === "BOOKED") return "seat-booked";
    if (seat.status === "PENDING") return "seat-pending";
    if (isSelected) return "seat-selected";
    return "seat-available";
  };

  // Group seats into rows of 4 (2 left, 2 right)
  const rows = [];
  for (let i = 0; i < seats.length; i += 4) {
    rows.push(seats.slice(i, i + 4));
  }

  return (
    <div className="bus-chassis p-4 bg-light rounded-5 border border-3 mx-auto mt-3">
      {/* FRONT SECTION */}
      {/* FRONT OF BUS INDICATOR */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div className="text-muted small fw-bold">FRONT / ENTRANCE</div>
        <div className="driver-area">
          {/* Using Disc as a steering wheel replacement */}
          <Disc size={28} className="text-secondary" /> 
        </div>
      </div>

      {/* SEATING AREA */}
      <div className="d-flex flex-column gap-4">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="row align-items-center g-0">
            {/* LEFT 2 SEATS */}
            <div className="col-5 d-flex gap-2 justify-content-end">
              {row.slice(0, 2).map((seat) => (
                <Seat 
                  key={seat._id} 
                  seat={seat} 
                  className={getSeatStyles(seat)} 
                  onSelect={onSelect}
                  isSleeper={isSleeper(seat)}
                />
              ))}
            </div>

            {/* AISLE */}
            <div className="col-2 text-center">
              <div className="aisle-path"></div>
            </div>

            {/* RIGHT 2 SEATS */}
            <div className="col-5 d-flex gap-2 justify-content-start">
              {row.slice(2, 4).map((seat) => (
                <Seat 
                  key={seat._id} 
                  seat={seat} 
                  className={getSeatStyles(seat)} 
                  onSelect={onSelect}
                  isSleeper={isSleeper(seat)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .bus-chassis { 
          max-width: 450px; 
          border-color: #dee2e6 !important; 
          background: #f8f9fa !important;
          box-shadow: inset 0 0 15px rgba(0,0,0,0.05);
        }
        .driver-cabin { 
          background: #fff; padding: 10px; border-radius: 50%; border: 1px solid #ddd;
        }
        .entrance-step { 
          font-size: 10px; font-weight: 800; letter-spacing: 2px;
          border: 1px dashed #ccc; padding: 5px 15px; border-radius: 4px;
        }
        .aisle-path { 
          height: 40px; border-left: 2px dashed #e0e0e0; border-right: 2px dashed #e0e0e0; width: 30px; margin: 0 auto;
        }
        .seat-btn {
          border: 1.5px solid; border-radius: 8px; display: flex; flex-direction: column;
          align-items: center; justify-content: center; padding: 10px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); background: white;
          cursor: pointer; min-width: 55px; position: relative;
        }
        .seat-btn:active { transform: scale(0.92); }
        .sleeper-width { min-width: 85px; height: 50px; }
        .seat-available { border-color: #28a745; color: #28a745; box-shadow: 0 2px 4px rgba(40,167,69,0.1); }
        .seat-available:hover { background: #28a745; color: white; }
        .seat-selected { background: #0d6efd !important; border-color: #0b5ed7; color: white; transform: translateY(-2px); box-shadow: 0 4px 8px rgba(13,110,253,0.3); }
        .seat-booked { background: #eaedf0 !important; border-color: #d1d8dd; color: #adb5bd; cursor: not-allowed; }
        .seat-pending { background: #fff3cd !important; border-color: #ffeeba; color: #856404; cursor: not-allowed; }
        .seat-label { font-size: 11px; font-weight: 700; margin-top: 4px; }
      `}</style>
    </div>
  );
}

function Seat({ seat, className, onSelect, isSleeper }) {
  return (
    <button
      disabled={seat.status !== "AVAILABLE"}
      onClick={() => onSelect(seat)}
      className={`seat-btn ${className} ${isSleeper ? 'sleeper-width' : ''}`}
    >
      <Armchair size={isSleeper ? 20 : 16} strokeWidth={2.5} />
      <span className="seat-label">{seat.seatNumber}</span>
    </button>
  );
}