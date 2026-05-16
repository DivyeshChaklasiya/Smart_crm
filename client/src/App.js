import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import Tasks from "./pages/Tasks";
import ImportExport from "./pages/ImportExport";
import LeadDetails from "./pages/LeadDetails";

import Sidebar from "./components/Sidebar";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Chat from "./pages/Chat";

function Layout() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot";

  return (
    <>
      {!isAuthPage && <Sidebar />}

      <div className={isAuthPage ? "" : "main-content"}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<ForgotPassword />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/import-export" element={<ImportExport />} />
          <Route path="/leads/:id" element={<LeadDetails />} />
        <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;