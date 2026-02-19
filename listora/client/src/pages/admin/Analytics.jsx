import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import api from "../../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then(res => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading...</p>;

  const data = {
    labels: [
      "Bookings",
      "Users",
      "Providers",
      "Hotels",
      "Buses"
    ],
    datasets: [
      {
        label: "Platform Overview",
        data: [
          stats.totalBookings,
          stats.totalUsers,
          stats.totalProviders,
          stats.totalHotels,
          stats.totalBuses
        ],
        backgroundColor: "rgba(75,192,192,0.6)"
      }
    ]
  };

  return (
    <div style={{ width: "600px", margin: "auto" }}>
      <h2>Platform Analytics</h2>
      <Bar data={data} />
    </div>
  );
}
