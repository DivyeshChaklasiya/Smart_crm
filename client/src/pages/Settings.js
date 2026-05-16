import React, { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

function Settings() {
  const [password, setPassword] = useState("");
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // 🔥 CHANGE PASSWORD
  const handleChangePassword = async () => {
    try {
      await API.post("/users/reset-password", {
        email: localStorage.getItem("email"), // ⚠️ ensure login ma save karelu hoy
        newPassword: password,
      });

      toast.success("Password changed ✅");
      setPassword("");
    } catch {
      toast.error("Failed ❌");
    }
  };

  // 🔥 TOGGLE DARK MODE
  const toggleTheme = () => {
    if (dark) {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    }
    setDark(!dark);
  };

  return (
    <div className="container mt-4 fade-in">
      <h2 className="fw-bold mb-4">Settings ⚙️</h2>

      {/* 🔥 CHANGE PASSWORD */}
      <div className="card p-3 mb-4 shadow-sm">
        <h5>Change Password 🔒</h5>

        <input
          type="password"
          className="form-control mb-2"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn btn-primary"
          onClick={handleChangePassword}
        >
          Update Password
        </button>
      </div>

      {/* 🔥 DARK MODE */}
      <div className="card p-3 mb-4 shadow-sm">
        <h5>Theme 🌙</h5>

        <button className="btn btn-dark" onClick={toggleTheme}>
          {dark ? "Switch to Light ☀️" : "Switch to Dark 🌙"}
        </button>
      </div>

      {/* 🔥 NOTIFICATION TOGGLE */}
      <div className="card p-3 shadow-sm">
        <h5>Notifications 🔔</h5>

        <p>Email notifications coming soon 😎</p>
      </div>
    </div>
  );
}

export default Settings;