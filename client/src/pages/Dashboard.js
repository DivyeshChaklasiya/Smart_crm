import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

// 🔥 CHART IMPORTS
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

// 🔥 REGISTER CHART
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function Dashboard() {
  const [stats, setStats] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/leads/stats");
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 CHART DATA
  const data = {
    labels: ["New", "Contacted", "Converted"],
    datasets: [
      {
        label: "Leads",
        data: [
          stats.newLeads || 0,
          stats.contacted || 0,
          stats.converted || 0,
        ],
        backgroundColor: [
          "#0d6efd",
          "#ffc107",
          "#198754",
        ],
        borderRadius: 10,
      },
    ],
  };

  // 🔥 CHART OPTIONS
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  return (
    <div className="container mt-4">

      <h2 className="fw-bold mb-4 text-center">
        Smart CRM Dashboard 🚀
      </h2>

      {/* 🔥 STATS CARDS */}
      <div className="row">

        <div className="col-md-3 mb-3">
          <div className="card shadow border-0 text-center p-3 bg-primary text-white">
            <h5>Total Leads</h5>
            <h2>{stats.total || 0}</h2>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow border-0 text-center p-3 bg-warning">
            <h5>Contacted</h5>
            <h2>{stats.contacted || 0}</h2>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow border-0 text-center p-3 bg-success text-white">
            <h5>Converted</h5>
            <h2>{stats.converted || 0}</h2>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow border-0 text-center p-3 bg-danger text-white">
            <h5>Overdue</h5>
            <h2>{stats.overdue || 0}</h2>
          </div>
        </div>

      </div>

      {/* 🔥 CHART */}
      <div className="card shadow border-0 mt-4 p-4">
        <h4 className="mb-3">Leads Overview 📊</h4>

        <Bar data={data} options={options} />
      </div>

      {/* 🔥 BUTTONS */}
      <div className="text-center mt-4">

        <button
          className="btn btn-primary me-3"
          onClick={() => navigate("/leads")}
        >
          Manage Leads
        </button>

        <button
          className="btn btn-danger"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Dashboard;