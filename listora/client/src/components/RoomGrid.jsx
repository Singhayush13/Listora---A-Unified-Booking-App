import React from "react";
import { User, Check, Lock, Clock } from "lucide-react";

export default function RoomGrid({ rooms, selectedRoom, onSelect }) {
  
  const getRoomStyle = (room) => {
    const isSelected = selectedRoom === room._id;
    
    if (room.status === "BOOKED") return "room-booked";
    if (room.status === "PENDING") return "room-pending";
    if (isSelected) return "room-selected";
    return "room-available";
  };

  const getIcon = (room) => {
    if (room.status === "BOOKED") return <Lock size={14} />;
    if (room.status === "PENDING") return <Clock size={14} />;
    if (selectedRoom === room._id) return <Check size={14} />;
    return <User size={14} className="opacity-50" />;
  };

  return (
    <div className="room-selection-wrapper">
      <div className="room-grid-container">
        {rooms.map((room) => {
          const statusStyle = getRoomStyle(room);
          const isAvailable = room.status === "AVAILABLE";

          return (
            <div key={room._id} className="position-relative">
              <button
                disabled={!isAvailable}
                onClick={() => onSelect(room)}
                className={`room-block ${statusStyle}`}
                title={`Room ${room.roomNumber} - ${room.status}`}
              >
                <div className="room-content">
                  <span className="room-number">{room.roomNumber}</span>
                  <div className="room-meta">
                    {getIcon(room)}
                    <span className="capacity-text">{room.type || "STD"}</span>
                  </div>
                </div>
              </button>
              
              {/* Tooltip-style status indicator for mobile */}
              {selectedRoom === room._id && (
                <div className="selection-badge">Selected</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend for clarity */}
      <div className="d-flex flex-wrap gap-4 mt-4 pt-3 border-top justify-content-center">
        <div className="d-flex align-items-center gap-2 small fw-medium text-muted">
          <div className="legend-box available"></div> Available
        </div>
        <div className="d-flex align-items-center gap-2 small fw-medium text-muted">
          <div className="legend-box pending"></div> Pending
        </div>
        <div className="d-flex align-items-center gap-2 small fw-medium text-muted">
          <div className="legend-box booked"></div> Occupied
        </div>
        <div className="d-flex align-items-center gap-2 small fw-medium text-muted">
          <div className="legend-box selected"></div> Your Choice
        </div>
      </div>

      <style>{`
        .room-grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 12px;
          padding: 5px;
        }

        .room-block {
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 12px;
          border: 2px solid transparent;
          position: relative;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
        }

        .room-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .room-number {
          font-weight: 800;
          font-size: 1.1rem;
          color: #1e293b;
        }

        .room-meta {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Status: Available */
        .room-available {
          border-color: #e2e8f0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .room-available:hover {
          transform: translateY(-4px);
          border-color: #3b82f6;
          box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.2);
        }

        /* Status: Selected */
        .room-selected {
          background: #eff6ff;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
        .room-selected .room-number, .room-selected .room-meta {
          color: #2563eb;
        }

        /* Status: Pending */
        .room-pending {
          background: #fffbeb;
          border-color: #f59e0b;
          cursor: not-allowed;
          opacity: 0.8;
        }
        .room-pending .room-number { color: #b45309; }

        /* Status: Booked */
        .room-booked {
          background: #f1f5f9;
          border-color: #cbd5e1;
          cursor: not-allowed;
        }
        .room-booked .room-number, .room-booked .room-meta {
          color: #94a3b8;
        }

        /* Legend */
        .legend-box { width: 12px; height: 12px; border-radius: 3px; }
        .legend-box.available { background: #ffffff; border: 1px solid #cbd5e1; }
        .legend-box.pending { background: #f59e0b; }
        .legend-box.booked { background: #cbd5e1; }
        .legend-box.selected { background: #3b82f6; }

        .selection-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #2563eb;
          color: white;
          font-size: 0.6rem;
          padding: 2px 8px;
          border-radius: 10px;
          font-weight: bold;
          z-index: 2;
        }

        @media (max-width: 576px) {
          .room-grid-container {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
}