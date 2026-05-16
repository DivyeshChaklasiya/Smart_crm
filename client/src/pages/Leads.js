import React, { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Leads() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const [editLead, setEditLead] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const res = await API.get("/leads");
    setLeads(res.data);
  };

  const handleAddLead = async () => {
    if (!name || !email) {
      return toast.warning("Name & Email required ⚠️");
    }

    await API.post("/leads", {
      name,
      email,
      phone,
      dueDate,
      notes,
    });

    toast.success("Lead added ✅");

    setName("");
    setEmail("");
    setPhone("");
    setDueDate("");
    setNotes("");

    fetchLeads();
  };

  const handleDelete = async (id) => {
    await API.delete(`/leads/${id}`);
    toast.success("Deleted 🗑️");
    fetchLeads();
  };

  const handleStatusChange = async (id, status) => {
    await API.put(`/leads/${id}`, { status });
    toast.info("Status updated 🔄");
    fetchLeads();
  };

  const handleUpdateLead = async () => {
    try {
      await API.put(`/leads/${editLead._id}`, editLead);
      toast.success("Lead updated ✏️");
      setEditLead(null);
      fetchLeads();
    } catch {
      toast.error("Update failed ❌");
    }
  };

  const getBadge = (status) => {
    if (status === "New") return "badge bg-primary";
    if (status === "Contacted") return "badge bg-warning text-dark";
    if (status === "Converted") return "badge bg-success";
    return "badge bg-secondary";
  };

  const filtered = leads.filter((l) => {
    return (
      l.name.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter ? l.status === statusFilter : true)
    );
  });

  return (
    <div className="container mt-4">

      <h2 className="fw-bold mb-3">Leads 📋</h2>

      {/* SEARCH */}
      <input
        className="form-control mb-3 shadow-sm"
        placeholder="Search leads..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FILTER */}
      <select
        className="form-select w-auto mb-4 shadow-sm"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">All Leads</option>
        <option value="New">New</option>
        <option value="Contacted">Contacted</option>
        <option value="Converted">Converted</option>
      </select>

      {/* FORM */}
      <div className="card p-3 mb-4 shadow-sm border-0">
        <div className="row g-2">

          <div className="col-md-2">
            <input className="form-control" placeholder="Name"
              value={name} onChange={(e)=>setName(e.target.value)} />
          </div>

          <div className="col-md-2">
            <input className="form-control" placeholder="Email"
              value={email} onChange={(e)=>setEmail(e.target.value)} />
          </div>

          <div className="col-md-2">
            <input className="form-control" placeholder="Phone"
              value={phone} onChange={(e)=>setPhone(e.target.value)} />
          </div>

          <div className="col-md-2">
            <input type="date" className="form-control"
              value={dueDate} onChange={(e)=>setDueDate(e.target.value)} />
          </div>

          <div className="col-md-2">
            <input className="form-control" placeholder="Notes"
              value={notes} onChange={(e)=>setNotes(e.target.value)} />
          </div>

          <div className="col-md-2">
            <button className="btn btn-primary w-100"
              onClick={handleAddLead}>
              Add
            </button>
          </div>

        </div>
      </div>

      {/* TABLE */}
      <div className="card shadow border-0">
        <div className="table-responsive">
          <table className="table table-hover">

            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Notes</th>
                <th>Status</th>
                <th>Due</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((lead) => {
                const overdue =
                  lead.dueDate && new Date(lead.dueDate) < new Date();

                return (
                  <tr key={lead._id}>

                    {/* ✅ ONLY NAME CLICKABLE */}
                    <td
                      style={{ cursor: "pointer", color: "#0d6efd" }}
                      onClick={() => navigate(`/leads/${lead._id}`)}
                    >
                      {lead.name}
                    </td>

                    <td>{lead.email}</td>
                    <td>{lead.phone}</td>
                    <td>{lead.notes || "-"}</td>

                    <td>
                      <span className={getBadge(lead.status)}>
                        {lead.status}
                      </span>
                    </td>

                    <td style={{ color: overdue ? "red" : "" }}>
                      {lead.dueDate
                        ? new Date(lead.dueDate).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>
                      <select
                        className="form-select form-select-sm d-inline w-auto me-2"
                        value={lead.status}
                        onChange={(e) =>
                          handleStatusChange(lead._id, e.target.value)
                        }
                      >
                        <option>New</option>
                        <option>Contacted</option>
                        <option>Converted</option>
                      </select>

                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => setEditLead(lead)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(lead._id)}
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editLead && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">

              <h5>Edit Lead ✏️</h5>

              <input className="form-control mb-2"
                value={editLead.name}
                onChange={(e)=>setEditLead({...editLead, name:e.target.value})}
              />

              <input className="form-control mb-2"
                value={editLead.email}
                onChange={(e)=>setEditLead({...editLead, email:e.target.value})}
              />

              <input className="form-control mb-2"
                value={editLead.phone}
                onChange={(e)=>setEditLead({...editLead, phone:e.target.value})}
              />

              <input type="date" className="form-control mb-2"
                value={editLead.dueDate?.substring(0,10)}
                onChange={(e)=>setEditLead({...editLead, dueDate:e.target.value})}
              />

              <input className="form-control mb-2"
                value={editLead.notes || ""}
                onChange={(e)=>setEditLead({...editLead, notes:e.target.value})}
              />

              <select className="form-select mb-3"
                value={editLead.status}
                onChange={(e)=>setEditLead({...editLead, status:e.target.value})}
              >
                <option>New</option>
                <option>Contacted</option>
                <option>Converted</option>
              </select>

              <div className="text-end">
                <button className="btn btn-secondary me-2"
                  onClick={()=>setEditLead(null)}>
                  Cancel
                </button>

                <button className="btn btn-primary"
                  onClick={handleUpdateLead}>
                  Save
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Leads;