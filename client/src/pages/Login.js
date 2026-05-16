import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/users/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", email);
      alert("Login successful ✅");
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed ❌");
    }
  };

  return (
    <div className="login-page">

      {/* 🔥 LEFT SIDE CONTENT */}
      <div className="login-left">

        {/* 🔝 TOP TEXT */}
        <div className="login-top">
          <h1>Smart CRM 🚀</h1>
          <p>Manage your leads smarter, faster & better.</p>

          <ul>
            <li>✔ Easy to use</li>
            <li>✔ Track leads</li>
            <li>✔ Grow faster</li>
          </ul>
        </div>

        {/* 🔻 BOTTOM LOGIN CARD */}
        <div className="login-bottom">
          <div className="login-card">
            <h2>Login</h2>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
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

            <div className="options">
              <span>☑ Remember Me</span>

              {/* 🔥 FIXED */}
              <span 
                className="forgot"
                onClick={() => navigate("/forgot")}
                style={{ cursor: "pointer" }}
              >
                Forgot Password
              </span>
            </div>

            <button onClick={handleLogin}>Log in</button>

            <p className="register">
              Don’t have account?{" "}
              
              {/* 🔥 FIXED */}
              <span 
                onClick={() => navigate("/register")}
                style={{ cursor: "pointer" }}
              >
                Register
              </span>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;