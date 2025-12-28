import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { addTransaction } from "./store";
import { Activity, MapPin, DollarSign, TrendingUp, Lock } from "lucide-react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// FIX: Added transports to ensure connection works even with strict firewalls
const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
});

function App() {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.fraud.transactions);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  useEffect(() => {
    // Only try to listen for transactions if we are logged in
    if (isLoggedIn) {
      socket.on("connect", () => setIsConnected(true));
      socket.on("disconnect", () => setIsConnected(false));
      socket.on("new-transaction", (data) => dispatch(addTransaction(data)));

      // Check if already connected
      if (socket.connected) setIsConnected(true);
    }
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("new-transaction");
    };
  }, [isLoggedIn, dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/login",
        loginData
      );
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        setIsLoggedIn(true);
      }
    } catch (err) {
      alert("Invalid login credentials!");
    }
  };

  if (!isLoggedIn) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f0f2f5",
        }}
      >
        <form
          onSubmit={handleLogin}
          style={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            width: "350px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <Lock size={40} color="#3b82f6" />
            <h2>Manager Login</h2>
          </div>
          <input
            type="email"
            placeholder="Email"
            required
            style={inputStyle}
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            required
            style={inputStyle}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
          />
          <button type="submit" style={buttonStyle}>
            Access Dashboard
          </button>
          <p
            style={{
              fontSize: "12px",
              color: "#666",
              marginTop: "15px",
              textAlign: "center",
            }}
          >
            manager@store.com / password123
          </p>
        </form>
      </div>
    );
  }

  const chartData = {
    labels: transactions.map((t) => t.time).reverse(),
    datasets: [
      {
        label: "Risk Score Trend",
        data: transactions.map((t) => t.riskScore).reverse(),
        borderColor: "#3b82f6",
        tension: 0.4,
      },
    ],
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f4f7f6",
        minHeight: "100vh",
        fontFamily: "sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1>🛡️ Fraud Guard Dashboard</h1>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <div
            style={{ color: isConnected ? "green" : "red", fontWeight: "bold" }}
          >
            {isConnected ? "● System Live" : "○ System Offline"}
          </div>
          <button
            onClick={() => setIsLoggedIn(false)}
            style={{ padding: "5px 10px", cursor: "pointer" }}
          >
            Logout
          </button>
        </div>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={cardStyle}>
            <Activity /> <h3>Monitoring</h3> <p>Live Feed Active</p>
          </div>
          <div style={cardStyle}>
            <TrendingUp /> <h3>Trends</h3> <p>AI Risk Analysis</p>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <Line
            data={chartData}
            options={{ responsive: true, maintainAspectRatio: false }}
            height={200}
          />
        </div>
      </div>

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Recent Activity</h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
              <th>Time</th>
              <th>Location</th>
              <th>Amount</th>
              <th>Risk</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px 0" }}>{tx.time}</td>
                <td>
                  <MapPin size={14} /> {tx.location}
                </td>
                <td>
                  <DollarSign size={14} /> {tx.amount}
                </td>
                <td>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "5px",
                      color: "white",
                      backgroundColor:
                        tx.riskScore > 70 ? "#ff4d4d" : "#2ecc71",
                    }}
                  >
                    {tx.riskScore}%
                  </span>
                </td>
                <td style={{ fontSize: "13px", color: "#666" }}>{tx.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "5px",
  border: "1px solid #ddd",
  boxSizing: "border-box",
};
const buttonStyle = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
};
const cardStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  textAlign: "center",
};

export default App;
