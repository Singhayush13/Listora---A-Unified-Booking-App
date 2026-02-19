import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const AddHotel = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [images, setImages] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    pricePerNight: "",
    rooms: "",
    amenities: "",
    foodAvailable: false,
    foodTypes: ""
  });

  /* ---------------- Handlers ---------------- */

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleFiles = files => {
    setImages(prev => [...prev, ...Array.from(files)]);
  };

  const removeImage = index => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  /* ---------------- Image Reordering ---------------- */

  const onDragStart = index => setDragIndex(index);

  const onDrop = index => {
    if (dragIndex === null) return;

    const reordered = [...images];
    const moved = reordered.splice(dragIndex, 1)[0];
    reordered.splice(index, 0, moved);

    setImages(reordered);
    setDragIndex(null);
  };

  /* ---------------- Submit with Progress ---------------- */

  const submit = async () => {
    if (!form.name || !form.pricePerNight) {
      alert("Hotel name and price are required");
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);

      const formData = new FormData();

      Object.entries(form).forEach(([k, v]) => {
        if (k === "amenities") {
          formData.append(
            "amenities",
            v.split(",").map(a => a.trim()).filter(Boolean)
          );
        } else if (k === "foodTypes" && form.foodAvailable) {
          formData.append(
            "foodTypes",
            v.split(",").map(f => f.trim()).filter(Boolean)
          );
        } else {
          formData.append(k, v);
        }
      });

      images.forEach(img => formData.append("images", img));

      await api.post("/hotels", formData, {
        onUploadProgress: e => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setUploadProgress(percent);
        }
      });

      navigate("/provider/hotels");
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-xl-9">

          <h2 className="fw-bold mb-1 text-primary">Add New Hotel</h2>
          <p className="text-muted mb-4">
            Upload images, arrange order, and publish your hotel
          </p>

          <div className="card border-0 shadow-lg rounded-4">
            <div className="card-body p-4 p-md-5">

              {/* BASIC INFO */}
              <Section title="Basic Information" />
              <div className="row g-3">
                <Input col="6" label="Hotel Name *" name="name" onChange={handleChange} />
                <Input col="6" label="Phone Number" name="phone" onChange={handleChange} />
                <Textarea label="Address" name="address" onChange={handleChange} />
              </div>

              <Divider />

              {/* PRICING */}
              <Section title="Pricing & Capacity" />
              <div className="row g-3">
                <Input col="6" type="number" label="Price per Night (₹) *" name="pricePerNight" onChange={handleChange} />
                <Input col="6" type="number" label="Rooms" name="rooms" onChange={handleChange} />
              </div>

              <Divider />

              {/* FACILITIES */}
              <Section title="Facilities" />
              <div className="row g-3 align-items-end">
                <Input col="6" label="Amenities (WiFi, AC)" name="amenities" onChange={handleChange} />

                <div className="col-md-6">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="foodAvailable"
                      checked={form.foodAvailable}
                      onChange={handleChange}
                    />
                    <label className="form-check-label fw-semibold">
                      Food Available
                    </label>
                  </div>
                </div>

                {form.foodAvailable && (
                  <Input col="6" label="Food Types" name="foodTypes" onChange={handleChange} />
                )}
              </div>

              <Divider />

              {/* IMAGE UPLOAD */}
              <Section title="Hotel Images (Drag to Reorder)" />

              <div
                className="border border-dashed rounded-4 p-4 text-center"
                style={{ cursor: "pointer" }}
                onClick={() => document.getElementById("fileInput").click()}
              >
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  accept="image/*"
                  hidden
                  onChange={e => handleFiles(e.target.files)}
                />
                <h6 className="fw-bold text-primary mb-1">
                  Click to upload images
                </h6>
                <p className="text-muted mb-0">
                  Drag thumbnails below to reorder
                </p>
              </div>

              {/* PREVIEW + REORDER */}
              {images.length > 0 && (
                <div className="row g-3 mt-4">
                  {images.map((img, i) => (
                    <div
                      className="col-6 col-md-3"
                      key={i}
                      draggable
                      onDragStart={() => onDragStart(i)}
                      onDragOver={e => e.preventDefault()}
                      onDrop={() => onDrop(i)}
                    >
                      <div className="position-relative shadow-sm rounded-3 overflow-hidden">
                        <img
                          src={URL.createObjectURL(img)}
                          alt="preview"
                          loading="lazy"
                          style={{
                            width: "100%",
                            height: "140px",
                            objectFit: "cover",
                            imageRendering: "auto"
                          }}
                        />
                        <button
                          className="btn btn-danger btn-sm position-absolute top-0 end-0"
                          onClick={() => removeImage(i)}
                        >
                          ✕
                        </button>
                        <span className="badge bg-dark position-absolute bottom-0 start-0 m-1">
                          {i + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PROGRESS BAR */}
              {loading && (
                <div className="mt-4">
                  <div className="progress" style={{ height: "10px" }}>
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated"
                      style={{
                        width: `${uploadProgress}%`,
                        background: "linear-gradient(135deg, #4f46e5, #6366f1)"
                      }}
                    />
                  </div>
                  <small className="text-muted">{uploadProgress}% uploading...</small>
                </div>
              )}

              {/* ACTION */}
              <div className="d-flex justify-content-end mt-5">
                <button
                  className="btn btn-lg text-white px-5"
                  disabled={loading}
                  onClick={submit}
                  style={{
                    background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                    borderRadius: "14px",
                    boxShadow: "0 12px 30px rgba(79,70,229,0.4)"
                  }}
                >
                  {loading ? "Uploading..." : "Publish Hotel"}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Small Components ---------- */

const Section = ({ title }) => (
  <h6 className="fw-bold text-uppercase mb-3 text-primary">
    {title}
  </h6>
);

const Divider = () => <hr className="my-4" />;

const Input = ({ col, label, name, type = "text", onChange }) => (
  <div className={`col-md-${col}`}>
    <label className="form-label fw-semibold">{label}</label>
    <input
      type={type}
      name={name}
      className="form-control form-control-lg"
      onChange={onChange}
    />
  </div>
);

const Textarea = ({ label, name, onChange }) => (
  <div className="col-12">
    <label className="form-label fw-semibold">{label}</label>
    <textarea
      name={name}
      rows="3"
      className="form-control"
      onChange={onChange}
    />
  </div>
);

export default AddHotel;
