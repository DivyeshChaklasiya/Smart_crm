import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Auth.css"; // 🔥 common css


function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await API.post("/users/register", {
        name,
        email,
        password,
      });

      alert("Registered Successfully ✅");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Error ❌");
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">
        <h2>Create Account 🚀</h2>

        <div className="input-group">
          <label>Name</label>
          <input
            placeholder="Enter name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button onClick={handleRegister}>Register</button>

        <p className="switch">
          Already have account?{" "}
          <span onClick={() => navigate("/")}>Login</span>
        </p>
      </div>

    </div>
  );
}

export default Register;