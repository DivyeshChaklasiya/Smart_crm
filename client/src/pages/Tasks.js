import React, { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch {
      toast.error("Error loading tasks ❌");
    }
  };

  const addTask = async () => {
    if (!title) {
      return toast.warning("Task title required ⚠️");
    }

    try {
      await API.post("/tasks", { title, dueDate });

      toast.success("Task added ✅");

      setTitle("");
      setDueDate("");

      fetchTasks();
    } catch {
      toast.error("Error adding task ❌");
    }
  };

  const markDone = async (id) => {
    try {
      await API.put(`/tasks/${id}`, { status: "Done" });
      toast.info("Task completed 🎉");
      fetchTasks();
    } catch {
      toast.error("Error updating task ❌");
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      toast.success("Task deleted 🗑️");
      fetchTasks();
    } catch {
      toast.error("Delete failed ❌");
    }
  };

  return (
    <div className="container mt-4 fade-in">

      <h2 className="fw-bold mb-3">Tasks / Follow-ups 📝</h2>

      {/* 🔥 ADD TASK */}
      <div className="card p-3 mb-4 shadow-sm border-0">
        <div className="row g-2">

          <div className="col-md-5">
            <input
              className="form-control"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <input
              type="date"
              className="form-control"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <button className="btn btn-primary w-100" onClick={addTask}>
              Add Task
            </button>
          </div>

        </div>
      </div>

      {/* 🔥 TASK LIST */}
      <div className="card shadow border-0">
        <ul className="list-group list-group-flush">

          {tasks.length === 0 && (
            <li className="list-group-item text-center">
              No tasks yet 😴
            </li>
          )}

          {tasks.map((t) => {
            const overdue =
              t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "Done";

            return (
              <li
                key={t._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >

                <div>
                  <strong>{t.title}</strong>

                  <div style={{ fontSize: "12px" }}>
                    {t.dueDate
                      ? "Due: " +
                        new Date(t.dueDate).toLocaleDateString()
                      : "No date"}
                  </div>

                  {overdue && (
                    <span className="badge bg-danger mt-1">
                      Overdue
                    </span>
                  )}
                </div>

                <div>

                  {t.status !== "Done" && (
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => markDone(t._id)}
                    >
                      Done
                    </button>
                  )}

                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => deleteTask(t._id)}
                  >
                    Delete
                  </button>

                </div>

              </li>
            );
          })}

        </ul>
      </div>

    </div>
  );
}

export default Tasks;