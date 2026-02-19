import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Providers from "./Providers";
import Users from "./Users";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [bookingTypes, setBookingTypes] = useState([]);
  const [bookingStatus, setBookingStatus] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/admin/stats").then((res) => setStats(res.data));
    api.get("/admin/monthly-revenue").then((res) => setMonthlyRevenue(res.data));
    api.get("/admin/booking-types").then((res) => setBookingTypes(res.data));
    api.get("/admin/booking-status").then((res) => setBookingStatus(res.data));
    api.get("/admin/users").then((res) => setUsers(res.data));
  }, []);

  if (!stats) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "sans-serif", color: "#666" }}>
        <h3>Loading Analytics...</h3>
      </div>
    );
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const revenueData = {
    labels: months,
    datasets: [{
      label: "Revenue (₹)",
      data: months.map((_, i) => {
        const found = monthlyRevenue.find((m) => m._id === i + 1);
        return found ? found.total : 0;
      }),
      borderColor: "#4F46E5",
      backgroundColor: "rgba(79, 70, 229, 0.1)",
      fill: true,
      tension: 0.4,
    }],
  };

  const typeData = {
    labels: bookingTypes.map((t) => t._id),
    datasets: [{
      data: bookingTypes.map((t) => t.count),
      backgroundColor: ["#6366F1", "#EC4899", "#8B5CF6"],
    }],
  };

  const statusData = {
    labels: bookingStatus.map((s) => s._id),
    datasets: [{
      data: bookingStatus.map((s) => s.count),
      backgroundColor: ["#F59E0B", "#10B981", "#EF4444"],
    }],
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    }
  };

  return (
    <div style={{ backgroundColor: "#F9FAFB", minHeight: "100vh", padding: "40px 20px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        <header style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#111827", margin: 0 }}>Admin Overview</h1>
          <p style={{ color: "#6B7280", marginTop: "5px" }}>Manage your platform performance and users.</p>
        </header>

        {/* ================= STATS CARDS ================= */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "20px", 
          marginBottom: "40px" 
        }}>
          <Card title="Total Bookings" value={stats.totalBookings} icon="📅" color="#EEF2FF" textColor="#4338CA" />
          <Card title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon="💰" color="#ECFDF5" textColor="#047857" />
          <Card title="Active Users" value={stats.totalUsers} icon="👥" color="#FFFBEB" textColor="#B45309" />
          <Card title="Providers" value={stats.totalProviders} icon="🏨" color="#FDF2F8" textColor="#BE185D" />
        </div>

        {/* ================= CHARTS ================= */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "30px", marginBottom: "50px" }}>
          <ChartContainer title="Revenue Trends">
            <Line data={revenueData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </ChartContainer>

          <div style={{ display: "grid", gap: "30px" }}>
            <ChartContainer title="Booking Distribution">
              <div style={{ maxWidth: "250px", margin: "0 auto" }}>
                <Pie data={typeData} />
              </div>
            </ChartContainer>
            <ChartContainer title="Booking Status">
              <div style={{ maxWidth: "250px", margin: "0 auto" }}>
                <Pie data={statusData} />
              </div>
            </ChartContainer>
          </div>
        </div>

        {/* ================= Users ================= */}
        <Users/>
        {/* ================= Providers ================= */}
        <Providers />
          
        </div>
      </div>
  );
}

/* ================= STYLED SUB-COMPONENTS ================= */

function Card({ title, value, icon, color, textColor }) {
  return (
    <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #F3F4F6" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
        <div>
          <p style={{ margin: 0, fontSize: "14px", color: "#6B7280", fontWeight: "500" }}>{title}</p>
          <h2 style={{ margin: "8px 0 0 0", fontSize: "24px", fontWeight: "bold", color: "#111827" }}>{value}</h2>
        </div>
        <div style={{ backgroundColor: color, padding: "8px", borderRadius: "10px", fontSize: "20px" }}>{icon}</div>
      </div>
    </div>
  );
}

function ChartContainer({ title, children }) {
  return (
    <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", border: "1px solid #F3F4F6" }}>
      <h3 style={{ marginTop: 0, marginBottom: "20px", fontSize: "16px", fontWeight: "600", color: "#374151" }}>{title}</h3>
      {children}
    </div>
  );
}

function SectionContainer({ title, children }) {
  return (
    <div style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #F3F4F6" }}>
      <div style={{ padding: "20px", borderBottom: "1px solid #F3F4F6", backgroundColor: "#fff" }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>{title}</h3>
      </div>
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>{children}</div>
    </div>
  );
}

function ListItem({ children }) {
  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      padding: "16px 20px", 
      borderBottom: "1px solid #F9FAFB",
      transition: "background 0.2s"
    }}>
      {children}
    </div>
  );
}

/* ================= BUTTON STYLES ================= */

const baseBtn = {
  padding: "6px 14px",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: "600",
  cursor: "pointer",
  border: "none",
  transition: "all 0.2s"
};

const deleteBtnStyle = { ...baseBtn, backgroundColor: "#FEE2E2", color: "#B91C1C" };
const suspendBtnStyle = { ...baseBtn, backgroundColor: "#F3F4F6", color: "#374151" };
const activateBtnStyle = { ...baseBtn, backgroundColor: "#D1FAE5", color: "#065F46" };