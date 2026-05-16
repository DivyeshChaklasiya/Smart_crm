import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      await API.post("/users/reset-password", {
        email,
        newPassword,
      });

      alert("Password Updated ✅");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Error ❌");
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">
        <h2>Reset Password 🔐</h2>

        <div className="input-group">
          <label>Email</label>
          <input
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <button onClick={handleReset}>Update Password</button>

        <button
  className="btn btn-outline-light mt-3 w-100"
  onClick={() => navigate("/")}
>
  ⬅ Back to Login
</button>
      </div>

    </div>
  );
}

export default ForgotPassword;