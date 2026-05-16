import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  FaTachometerAlt,
  FaUserFriends,
  FaUser,
  FaCog,
  FaBell,
  FaTasks,
  FaFileImport,
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaBars,
  FaComments
} from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
      document.body.classList.add("dark-mode");
      setDark(true);
    }
  }, []);

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
    <>
      {/* 🔥 MOBILE TOP BAR */}
      <div className="topbar">
        <FaBars onClick={() => setOpen(!open)} />
        <span onClick={() => navigate("/dashboard")}>🚀 CRM</span>
      </div>

      {/* 🔥 SIDEBAR */}
      <div className={`sidebar ${open ? "open" : "closed"}`}>

        <h3 className="logo">🚀 CRM</h3>

        {/* DASHBOARD */}
        <button
          className={location.pathname === "/dashboard" ? "active" : ""}
          onClick={() => navigate("/dashboard")}
        >
          <FaTachometerAlt /> Dashboard
        </button>

        {/* LEADS */}
        <button
          className={location.pathname === "/leads" ? "active" : ""}
          onClick={() => navigate("/leads")}
        >
          <FaUserFriends /> Leads
        </button>

        {/* PROFILE */}
        <button
          className={location.pathname === "/profile" ? "active" : ""}
          onClick={() => navigate("/profile")}
        >
          <FaUser /> Profile
        </button>

        {/* SETTINGS */}
        <button
          className={location.pathname === "/settings" ? "active" : ""}
          onClick={() => navigate("/settings")}
        >
          <FaCog /> Settings
        </button>

        {/* NOTIFICATIONS */}
        <button
          className={location.pathname === "/notifications" ? "active" : ""}
          onClick={() => navigate("/notifications")}
        >
          <FaBell /> Notifications
        </button>

        {/* TASKS */}
        <button
          className={location.pathname === "/tasks" ? "active" : ""}
          onClick={() => navigate("/tasks")}
        >
          <FaTasks /> Tasks
        </button>

        {/* IMPORT / EXPORT */}
        <button
          className={location.pathname === "/import-export" ? "active" : ""}
          onClick={() => navigate("/import-export")}
        >
          <FaFileImport /> Import / Export
        </button>

        {/* DARK MODE */}
        <button onClick={toggleTheme}>
          {dark ? <FaSun /> : <FaMoon />} {dark ? "Light" : "Dark"}
        </button>
        <button
  className={location.pathname === "/chat" ? "active" : ""}
  onClick={() => navigate("/chat")}
>
  <FaComments /> Chat
</button>

        {/* LOGOUT */}
        <button
          className="logout"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </>
  );
}

export default Sidebar;