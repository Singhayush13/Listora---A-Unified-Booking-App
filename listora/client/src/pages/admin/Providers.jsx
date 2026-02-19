import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function Providers() {

  const [providers, setProviders] = useState([]);

  useEffect(() => {
    api.get("/admin/providers")
      .then(res => setProviders(res.data));
  }, []);

  const toggleSuspend = async (id) => {
    await api.put(`/admin/providers/${id}/suspend`);

    setProviders(providers.map(p =>
      p._id === id
        ? { ...p, isSuspended: !p.isSuspended }
        : p
    ));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>Provider Management</h2>

      {/* Scroll wrapper for small screens */}
      <div style={{
        overflowX: "auto",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
      }}>

        <table style={{
          width: "100%",
          minWidth: "750px",
          borderCollapse: "collapse"
        }}>

          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Hotels</th>
              <th style={thStyle}>Buses</th>
              <th style={thStyle}>Joined</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>

          <tbody>
            {providers.map(p => (
              <tr key={p._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={tdStyle}>{p.name}</td>
                <td style={tdStyle}>{p.email}</td>
                <td style={tdStyle}>{p.hotelCount}</td>
                <td style={tdStyle}>{p.busCount}</td>
                <td style={tdStyle}>
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>

                <td style={tdStyle}>
                  <span style={{
                    padding: "4px 10px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    backgroundColor: p.isSuspended ? "#fee2e2" : "#dcfce7",
                    color: p.isSuspended ? "#b91c1c" : "#166534"
                  }}>
                    {p.isSuspended ? "Suspended" : "Active"}
                  </span>
                </td>

                <td style={tdStyle}>
                  <button
                    onClick={() => toggleSuspend(p._id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      border: "none",
                      background: p.isSuspended ? "#16a34a" : "#dc2626",
                      color: "#fff"
                    }}
                  >
                    {p.isSuspended ? "Activate" : "Suspend"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const thStyle = {
  padding: "12px 14px",
  textAlign: "left",
  fontSize: 13,
  fontWeight: 600,
  color: "#374151"
};

const tdStyle = {
  padding: "12px 14px",
  fontSize: 14,
  color: "#374151"
};
