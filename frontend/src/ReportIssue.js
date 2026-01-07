import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ReportIssue.css";

function ReportIssue() {
  const [assets, setAssets] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  // Get logged-in user info from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [ticketData, setTicketData] = useState({
    asset: "",
    issue: "",
    status: "received",
    assigned_technician: "",
    reported_by: storedUser.id, // store as ID
    opened_on: new Date().toISOString(), // store full ISO date
  });

  /* ================= FETCH ASSETS & TECHNICIANS ================= */
  useEffect(() => {
    // Fetch assets
    axios
      .get("http://127.0.0.1:8000/api/asset/")
      .then(res => setAssets(res.data))
      .catch(err => console.error("Error fetching assets:", err));

    // Fetch users and filter technicians
    axios
      .get("http://127.0.0.1:8000/api/users/")
      .then(res => {
        const techs = res.data.filter(u => u.role === "TECHNICIAN");
        setTechnicians(techs);
      })
      .catch(err => console.error("Error fetching technicians:", err));
  }, []);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData(prev => ({ ...prev, [name]: value }));
  };

  /* ================= SUBMIT TICKET ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...ticketData,
        opened_on: new Date().toISOString(), // always update timestamp
        reported_by: storedUser.id,          // ensure ID
      };

      // POST new ticket
      const res = await axios.post("http://127.0.0.1:8000/api/tickets/", payload);
      alert("Ticket created successfully!");

      // Update localStorage counter to notify other components
      const currentCount = Number(localStorage.getItem("newJobsCount")) || 0;
      localStorage.setItem("newJobsCount", currentCount + 1);
      window.dispatchEvent(new Event("storage"));

      // Reset form
      setTicketData({
        asset: "",
        issue: "",
        status: "received",
        assigned_technician: "",
        reported_by: storedUser.id,
        opened_on: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error creating ticket:", err);
      alert("Failed to create ticket");
    }
  };

  return (
    <div className="ticket-card">
      <h2>Create Repair Ticket</h2>

      <form onSubmit={handleSubmit} className="ticket-form">
        {/* Asset */}
        <label>Asset</label>
        <select
          name="asset"
          value={ticketData.asset}
          onChange={handleChange}
          required
        >
          <option value="">Select Asset</option>
          {assets.map(asset => (
            <option key={asset.id} value={asset.id}>
              {asset.name}
            </option>
          ))}
        </select>

        {/* Issue */}
        <label>Issue</label>
        <input
          type="text"
          name="issue"
          value={ticketData.issue}
          onChange={handleChange}
          placeholder="Describe the issue"
          required
        />

        {/* Status */}
        <label>Status</label>
        <select
          name="status"
          value={ticketData.status}
          onChange={handleChange}
        >
          <option value="received">Received</option>
          <option value="in progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        {/* Technician */}
        <label>Assign Technician</label>
        <select
          name="assigned_technician"
          value={ticketData.assigned_technician}
          onChange={handleChange}
        >
          <option value="">Select Technician</option>
          {technicians.map(tech => (
            <option key={tech.id} value={tech.id}>
              {tech.username}
            </option>
          ))}
        </select>

        <button type="submit">Create Ticket</button>
      </form>
    </div>
  );
}

export default ReportIssue;
