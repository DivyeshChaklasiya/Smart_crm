import React, { useEffect, useState } from "react";
import API from "../services/api";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const res = await API.get("/notifications");
    setNotifications(res.data);
  };

  const markRead = async (id) => {
    await API.put(`/notifications/${id}`);

    setNotifications((prev) =>
      prev.map((n) =>
        n._id === id ? { ...n, read: true } : n
      )
    );
  };

  return (
    <div className="container mt-4">

      <h2 className="fw-bold mb-4">
        Notifications 🔔
      </h2>

      <div className="card shadow border-0">
        <div className="list-group list-group-flush">

          {notifications.map((n) => (
            <div
              key={n._id}
              className={`list-group-item d-flex justify-content-between align-items-center ${
                !n.read ? "bg-light" : ""
              }`}
            >
              <div>
                <div>{n.message}</div>

                <small className="text-muted">
                  {new Date(n.createdAt).toLocaleString()}
                </small>
              </div>

              {!n.read && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => markRead(n._id)}
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}

        </div>
      </div>

    </div>
  );
}

export default Notifications;