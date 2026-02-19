import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function Users() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/admin/users")
      .then(res => setUsers(res.data));
  }, []);

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    await api.delete(`/admin/users/${id}`);
    setUsers(users.filter(u => u._id !== id));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>User Management</h2>

      {/* Scroll Wrapper */}
      <div style={{
        overflowX: "auto",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
      }}>

        <table style={{
          width: "100%",
          minWidth: "650px",
          borderCollapse: "collapse"
        }}>

          <thead style={{ backgroundColor: "#F9FAFB" }}>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Joined</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map(user => (
              <tr key={user._id} style={{ borderBottom: "1px solid #F3F4F6" }}>

                <td style={tdStyle}>{user.name}</td>

                <td style={tdStyle}>{user.email}</td>

                <td style={tdStyle}>
                  <span style={{
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                    backgroundColor:
                      user.role === "ADMIN"
                        ? "#E0E7FF"
                        : user.role === "PROVIDER"
                        ? "#FCE7F3"
                        : "#ECFDF5",
                    color:
                      user.role === "ADMIN"
                        ? "#3730A3"
                        : user.role === "PROVIDER"
                        ? "#9D174D"
                        : "#065F46"
                  }}>
                    {user.role}
                  </span>
                </td>

                <td style={tdStyle}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>

                <td style={tdStyle}>
                  {user.role !== "ADMIN" && (
                    <button
                      onClick={() => deleteUser(user._id)}
                      style={deleteBtnStyle}
                    >
                      Delete
                    </button>
                  )}
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
  textAlign: "left",
  padding: "14px 16px",
  fontSize: "13px",
  fontWeight: "600",
  color: "#6B7280"
};

const tdStyle = {
  padding: "14px 16px",
  fontSize: "14px",
  color: "#374151"
};

const deleteBtnStyle = {
  padding: "6px 12px",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: "600",
  backgroundColor: "#FEE2E2",
  color: "#B91C1C",
  border: "none",
  cursor: "pointer"
};
