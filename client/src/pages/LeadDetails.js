import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function LeadDetails() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);

  useEffect(() => {
    fetchLead();
  }, []);

  const fetchLead = async () => {
    const res = await API.get("/leads");
    const found = res.data.find((l) => l._id === id);
    setLead(found);
  };

  if (!lead) return <h3>Loading...</h3>;

  return (
    <div className="container mt-4">
      <h2>Lead Details 👤</h2>

      <div className="card p-3">
        <p><b>Name:</b> {lead.name}</p>
        <p><b>Email:</b> {lead.email}</p>
        <p><b>Phone:</b> {lead.phone}</p>
        <p><b>Status:</b> {lead.status}</p>
        <p><b>Notes:</b> {lead.notes || "-"}</p>
      </div>
    </div>
  );
}

export default LeadDetails;