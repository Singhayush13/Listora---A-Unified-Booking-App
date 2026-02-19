import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const EditHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
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

  /* ---------------- Load Hotel ---------------- */

  useEffect(() => {
    api.get(`/hotels/provider/${id}`)
      .then(res => {
        const h = res.data;

        setExistingImages(h.images || []);

        setForm({
          name: h.name || "",
          address: h.address || "",
          phone: h.phone || "",
          pricePerNight: h.pricePerNight || "",
          rooms: h.rooms || "",
          amenities: (h.amenities || []).join(", "),
          foodAvailable: h.foodAvailable || false,
          foodTypes: (h.foodTypes || []).join(", ")
        });
      })
      .catch(() => {
        alert("Failed to load hotel");
        navigate("/provider/hotels");
      });
  }, [id, navigate]);

  /* ---------------- Handlers ---------------- */

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleFiles = files => {
    setNewImages(prev => [...prev, ...Array.from(files)]);
  };

  const removeExistingImage = index => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = index => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  /* ---------------- Image Reorder ---------------- */

  const onDragStart = index => setDragIndex(index);

  const onDropExisting = index => {
    if (dragIndex === null) return;
    const reordered = [...existingImages];
    const moved = reordered.splice(dragIndex, 1)[0];
    reordered.splice(index, 0, moved);
    setExistingImages(reordered);
    setDragIndex(null);
  };

  const onDropNew = index => {
    if (dragIndex === null) return;
    const reordered = [...newImages];
    const moved = reordered.splice(dragIndex, 1)[0];
    reordered.splice(index, 0, moved);
    setNewImages(reordered);
    setDragIndex(null);
  };

  /* ---------------- Submit ---------------- */

  const submit = async () => {
    if (!form.name || !form.pricePerNight) {
      alert("Hotel name and price are required");
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);

      // update hotel details
      await api.put(`/hotels/${id}`, {
        ...form,
        amenities: form.amenities.split(",").map(a => a.trim()).filter(Boolean),
        foodTypes: form.foodTypes.split(",").map(f => f.trim()).filter(Boolean),
        images: existingImages
      });

      // upload new images if any
      if (newImages.length > 0) {
        const imgData = new FormData();
        newImages.forEach(img => imgData.append("images", img));

        await api.post(`/hotels/${id}/images`, imgData, {
          onUploadProgress: e => {
            const percent = Math.round((e.loaded * 100) / e.total);
            setUploadProgress(percent);
          }
        });
      }

      alert("Hotel updated successfully");
      navigate("/provider/hotels");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-xl-9">

          <h2 className="fw-bold text-primary mb-1">Edit Hotel</h2>
          <p className="text-muted mb-4">
            Update hotel information, images and facilities
          </p>

          <div className="card border-0 shadow-lg rounded-4">
            <div className="card-body p-4 p-md-5">

              {/* BASIC INFO */}
              <Section title="Basic Information" />
              <div className="row g-3">
                <Input col="6" label="Hotel Name *" name="name" value={form.name} onChange={handleChange} />
                <Input col="6" label="Phone Number" name="phone" value={form.phone} onChange={handleChange} />
                <Textarea label="Address" name="address" value={form.address} onChange={handleChange} />
              </div>

              <Divider />

              {/* PRICING */}
              <Section title="Pricing & Capacity" />
              <div className="row g-3">
                <Input col="6" type="number" label="Price per Night (₹) *" name="pricePerNight" value={form.pricePerNight} onChange={handleChange} />
                <Input col="6" type="number" label="Rooms" name="rooms" value={form.rooms} onChange={handleChange} />
              </div>

              <Divider />

              {/* FACILITIES */}
              <Section title="Facilities & Food" />
              <div className="row g-3 align-items-end">
                <Input col="6" label="Amenities" name="amenities" value={form.amenities} onChange={handleChange} />

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
                  <Input col="6" label="Food Types" name="foodTypes" value={form.foodTypes} onChange={handleChange} />
                )}
              </div>

              <Divider />

              {/* EXISTING IMAGES */}
              {existingImages.length > 0 && (
                <>
                  <Section title="Existing Images (Drag to reorder)" />
                  <div className="row g-3 mb-4">
                    {existingImages.map((img, i) => (
                      <ImageCard
                        key={i}
                        src={img}
                        index={i}
                        onRemove={removeExistingImage}
                        onDragStart={onDragStart}
                        onDrop={onDropExisting}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* NEW IMAGES */}
              <Section title="Add New Images" />
              <UploadBox onFiles={handleFiles} />

              {newImages.length > 0 && (
                <div className="row g-3 mt-4">
                  {newImages.map((img, i) => (
                    <ImageCard
                      key={i}
                      src={URL.createObjectURL(img)}
                      index={i}
                      onRemove={removeNewImage}
                      onDragStart={onDragStart}
                      onDrop={onDropNew}
                    />
                  ))}
                </div>
              )}

              {/* PROGRESS */}
              {loading && uploadProgress > 0 && (
                <div className="mt-4">
                  <div className="progress">
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated"
                      style={{
                        width: `${uploadProgress}%`,
                        background: "linear-gradient(135deg,#4f46e5,#6366f1)"
                      }}
                    />
                  </div>
                  <small className="text-muted">
                    Uploading images... {uploadProgress}%
                  </small>
                </div>
              )}

              {/* ACTIONS */}
              <div className="d-flex justify-content-end gap-3 mt-5">
                <button className="btn btn-outline-secondary px-4" onClick={() => navigate(-1)}>
                  Cancel
                </button>
                <button
                  className="btn btn-lg text-white px-5"
                  onClick={submit}
                  disabled={loading}
                  style={{
                    background: "linear-gradient(135deg,#4f46e5,#6366f1)",
                    borderRadius: "14px",
                    boxShadow: "0 12px 30px rgba(79,70,229,.4)"
                  }}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Reusable Components ---------------- */

const Section = ({ title }) => (
  <h6 className="fw-bold text-uppercase mb-3 text-primary">{title}</h6>
);

const Divider = () => <hr className="my-4" />;

const Input = ({ col, label, name, value, type = "text", onChange }) => (
  <div className={`col-md-${col}`}>
    <label className="form-label fw-semibold">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      className="form-control form-control-lg"
      onChange={onChange}
    />
  </div>
);

const Textarea = ({ label, name, value, onChange }) => (
  <div className="col-12">
    <label className="form-label fw-semibold">{label}</label>
    <textarea
      name={name}
      rows="3"
      value={value}
      className="form-control"
      onChange={onChange}
    />
  </div>
);

const UploadBox = ({ onFiles }) => (
  <div
    className="border border-dashed rounded-4 p-4 text-center"
    style={{ cursor: "pointer" }}
    onClick={() => document.getElementById("editFile").click()}
  >
    <input
      id="editFile"
      type="file"
      multiple
      hidden
      accept="image/*"
      onChange={e => onFiles(e.target.files)}
    />
    <h6 className="fw-bold text-primary mb-1">Click to upload images</h6>
    <p className="text-muted mb-0">Drag thumbnails to reorder</p>
  </div>
);

const ImageCard = ({ src, index, onRemove, onDragStart, onDrop }) => (
  <div
    className="col-6 col-md-3"
    draggable
    onDragStart={() => onDragStart(index)}
    onDragOver={e => e.preventDefault()}
    onDrop={() => onDrop(index)}
  >
    <div className="position-relative shadow-sm rounded-3 overflow-hidden">
      <img
        src={src}
        alt="hotel"
        style={{ height: 140, width: "100%", objectFit: "cover" }}
      />
      <button
        className="btn btn-danger btn-sm position-absolute top-0 end-0"
        onClick={() => onRemove(index)}
      >
        ✕
      </button>
      <span className="badge bg-dark position-absolute bottom-0 start-0 m-1">
        {index + 1}
      </span>
    </div>
  </div>
);

export default EditHotel;
