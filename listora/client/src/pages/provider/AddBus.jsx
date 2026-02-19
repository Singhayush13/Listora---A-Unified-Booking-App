import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function AddBus() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    busName: "",
    departure: "",
    destination: "",
    ac: false,
    suspension: "",
    totalSeats: 40,
    pricePerSeat: ""
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const submit = async e => {
    e.preventDefault();

    try {
      await api.post("/buses", {
        ...form,
        totalSeats: Number(form.totalSeats),
        pricePerSeat: Number(form.pricePerSeat)
      });

      alert("Bus added successfully");
      navigate("/provider");
    } catch (err) {
      alert("Failed to add bus");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 700 }}>
      <h3 className="fw-bold mb-4">Add New Bus</h3>

      <form onSubmit={submit} className="card p-4 shadow-sm">

        {/* BUS NAME */}
        <div className="mb-3">
          <label className="form-label">Bus Name</label>
          <input
            type="text"
            className="form-control"
            name="busName"
            required
            value={form.busName}
            onChange={handleChange}
            placeholder="Shivneri Travels"
          />
        </div>

        {/* ROUTE */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">From</label>
            <input
              type="text"
              className="form-control"
              name="departure"
              required
              value={form.departure}
              onChange={handleChange}
              placeholder="Mumbai"
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">To</label>
            <input
              type="text"
              className="form-control"
              name="destination"
              required
              value={form.destination}
              onChange={handleChange}
              placeholder="Pune"
            />
          </div>
        </div>

        {/* AC + SUSPENSION */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Suspension</label>
            <select
              className="form-select"
              name="suspension"
              value={form.suspension}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="Air">Air Suspension</option>
              <option value="Hydraulic">Hydraulic</option>
              <option value="Normal">Normal</option>
            </select>
          </div>

          <div className="col-md-6 mb-3 d-flex align-items-center">
            <div className="form-check mt-4">
              <input
                type="checkbox"
                className="form-check-input"
                name="ac"
                checked={form.ac}
                onChange={handleChange}
              />
              <label className="form-check-label">
                AC Bus
              </label>
            </div>
          </div>
        </div>

        {/* SEATS + PRICE */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Total Seats</label>
            <input
              type="number"
              className="form-control"
              name="totalSeats"
              min="30"
              max="44"
              required
              value={form.totalSeats}
              onChange={handleChange}
            />
            <small className="text-muted">
              Allowed range: 30 – 44
            </small>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Price Per Seat (₹)</label>
            <input
              type="number"
              className="form-control"
              name="pricePerSeat"
              required
              value={form.pricePerSeat}
              onChange={handleChange}
              placeholder="500"
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="d-flex gap-2 mt-3">
          <button type="submit" className="btn btn-primary w-100">
            Add Bus
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
}
