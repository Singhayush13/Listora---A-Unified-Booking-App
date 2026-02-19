import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiPrinter, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import api from "../services/api";

const Invoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    api
      .get(`/bookings/invoice/${id}`)
      .then((res) => setBooking(res.data))
      .catch(console.error);
  }, [id]);

  if (!booking) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  const isHotel = booking.bookingType === "HOTEL";

  return (
    <div className="invoice-page-wrapper">
      <div className="printable-area">
        
        {/* Navigation & Actions (Hidden during print) */}
        <div className="container no-print py-4">
          <div className="d-flex justify-content-between align-items-center">
            <button onClick={() => navigate(-1)} className="btn-back">
              <FiArrowLeft /> Back to Bookings
            </button>
            <div className="d-flex gap-2">
              <button 
                onClick={() => window.print()} 
                className="btn btn-primary d-flex align-items-center gap-2 shadow-sm px-4"
              >
                <FiPrinter /> Print / Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* The Invoice Sheet */}
        <div className="invoice-sheet shadow-lg">
          <div className="invoice-top-bar">
            <div className="brand-side">
              <h2 className="invoice-logo">LISTORA</h2>
              <p className="company-info">
                123 Premium Way, Tech City<br />
                contact@listora.travel | +91 98765 43210
              </p>
            </div>
            <div className="status-side text-end">
              <div className={`status-badge-large ${booking.status.toLowerCase()}`}>
                {booking.status}
              </div>
              <h1 className="doc-title">INVOICE</h1>
            </div>
          </div>

          <div className="divider"></div>

          <div className="info-grid">
            <div className="info-block">
              <label>Billed To</label>
              <h6>{booking.user?.name || "Valued Customer"}</h6>
              <p className="mb-0">{booking.user?.email}</p>
            </div>
            <div className="info-block text-md-end">
              <label>Invoice Details</label>
              <p className="mb-1"><strong>Invoice ID:</strong> <span className="text-uppercase text-muted">{booking._id.slice(-12)}</span></p>
              <p className="mb-1"><strong>Date:</strong> {new Date(booking.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              <p className="mb-0"><strong>Payment:</strong> Online Verified</p>
            </div>
          </div>

          <div className="table-responsive mt-5">
            <table className="table invoice-table">
              <thead>
                <tr>
                  <th>Service Description</th>
                  <th className="text-center">Schedule</th>
                  <th className="text-end">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span className="item-type">{isHotel ? "Accomodation" : "Transportation"}</span>
                    <h6 className="item-name mt-1">{isHotel ? booking.hotel?.name : booking.bus?.busName}</h6>
                    <p className="item-subtext mb-0 text-muted">
                      {isHotel 
                        ? `Room Assignment: ${booking.room?.roomNumber || 'Deluxe'}` 
                        : `Route: ${booking.bus?.departure} → ${booking.bus?.destination}`}
                    </p>
                    {!isHotel && <p className="item-subtext text-muted">Seat: {booking.seat?.seatNumber}</p>}
                  </td>
                  <td className="text-center align-middle">
                    <div className="date-box font-monospace">
                      {new Date(booking.fromDate).toLocaleDateString()}
                      {isHotel && <><br /><span className="text-muted">to</span><br />{new Date(booking.toDate).toLocaleDateString()}</>}
                    </div>
                  </td>
                  <td className="text-end align-middle price-cell">
                    ₹{booking.amountPaid?.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="summary-wrapper">
            <div className="summary-card">
              <div className="summary-line">
                <span>Subtotal</span>
                <span>₹{booking.amountPaid?.toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-line">
                <span>GST (0%)</span>
                <span>₹0.00</span>
              </div>
              <div className="summary-line total">
                <span>Grand Total</span>
                <span>₹{booking.amountPaid?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="invoice-footer-note">
            <div className="d-flex align-items-center justify-content-center gap-2 text-success mb-2 fw-bold">
              <FiCheckCircle /> Verified Digital Receipt
            </div>
            <p className="mb-1">This document is electronically generated and requires no physical signature.</p>
            <p className="mb-0 text-dark fw-bold">Listora Travels - Exploring simplified.</p>
          </div>
        </div>
      </div>

      <style>{`
        .invoice-page-wrapper {
          background: #f1f5f9;
          min-height: 100vh;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .btn-back { background: none; border: none; color: #64748b; font-weight: 600; display: flex; align-items: center; gap: 8px; }
        .invoice-sheet {
          max-width: 850px; margin: 0 auto 50px auto; background: #fff; padding: 60px; border-radius: 8px;
        }
        .invoice-logo { font-weight: 900; letter-spacing: 4px; color: #0f172a; margin: 0; }
        .company-info { color: #64748b; font-size: 0.8rem; margin-top: 8px; line-height: 1.4; }
        .doc-title { font-weight: 200; font-size: 3.5rem; color: #f1f5f9; margin: 0; line-height: 1; }
        .status-badge-large {
          display: inline-block; padding: 5px 15px; border-radius: 4px; font-weight: 800; font-size: 0.7rem; 
          letter-spacing: 1px; text-transform: uppercase; margin-bottom: 5px;
        }
        .status-badge-large.confirmed { background: #dcfce7; color: #15803d; }
        .status-badge-large.pending { background: #fef9c3; color: #a16207; }
        .divider { height: 1px; background: #e2e8f0; margin: 30px 0; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .info-block label { display: block; font-size: 0.65rem; text-transform: uppercase; font-weight: 700; color: #94a3b8; margin-bottom: 5px; }
        .invoice-table thead th { background: #f8fafc; border-bottom: 2px solid #0f172a; padding: 15px; font-size: 0.75rem; text-transform: uppercase; }
        .item-type { font-size: 0.65rem; font-weight: 800; color: #2563eb; text-transform: uppercase; }
        .price-cell { font-weight: 800; font-size: 1.2rem; }
        .summary-wrapper { display: flex; justify-content: flex-end; margin-top: 30px; }
        .summary-card { width: 280px; }
        .summary-line { display: flex; justify-content: space-between; padding: 8px 0; font-size: 0.9rem; }
        .summary-line.total { border-top: 2px solid #0f172a; margin-top: 10px; padding-top: 15px; font-weight: 800; font-size: 1.1rem; }
        .invoice-footer-note { margin-top: 60px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 30px; color: #94a3b8; font-size: 0.75rem; }

        @media print {
          body * { visibility: hidden !important; }
          .printable-area, .printable-area * { visibility: visible !important; }
          .printable-area { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
          .invoice-sheet { box-shadow: none !important; border: none !important; padding: 0 !important; margin: 0 !important; width: 100% !important; max-width: none !important; }
          .invoice-page-wrapper { background: white !important; }
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .doc-title { color: #eeeeee !important; }
        }

        @media (max-width: 768px) {
          .invoice-sheet { padding: 30px; }
          .info-grid { grid-template-columns: 1fr; }
          .info-block.text-md-end { text-align: left !important; }
        }
      `}</style>
    </div>
  );
};

export default Invoice;