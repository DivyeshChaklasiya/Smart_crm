import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
      document.body.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (dark) {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDark(!dark);
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-4">

      <span
        className="navbar-brand fw-bold"
        onClick={() => navigate("/dashboard")}
        style={{ cursor: "pointer" }}
      >
        🚀 CRM
      </span>

      <div className="ms-auto">

        {/* 🔥 DARK BUTTON */}
        <button
          className="btn btn-outline-light me-2"
          onClick={toggleTheme}
        >
          {dark ? "☀ Light" : "🌙 Dark"}
        </button>

        <button
          className="btn btn-outline-light me-2"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>

        <button
          className="btn btn-outline-light me-2"
          onClick={() => navigate("/leads")}
        >
          Leads
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
    </nav>
  );
}

export default Navbar;