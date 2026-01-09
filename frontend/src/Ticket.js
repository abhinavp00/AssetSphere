import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config"; // ✅ use BASE_URL
import "./Tickets.css";

function Ticket() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [assets, setAssets] = useState([]);

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  /* ================= FETCH TICKETS, USERS & ASSETS ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketRes, userRes, assetRes] = await Promise.all([
          axios.get(`${BASE_URL}/tickets/`),
          axios.get(`${BASE_URL}/users/`),
          axios.get(`${BASE_URL}/asset/`),
        ]);

        setUsers(userRes.data);
        setAssets(assetRes.data);

        const enrichedTickets = ticketRes.data.map(ticket => ({
          ...ticket,
          reported_by: ticket.reported_by || storedUser.username || "Unknown",
          opened_on: ticket.opened_on || new Date().toISOString(),
          assigned_at: ticket.assigned_technician
            ? ticket.assigned_at || new Date().toISOString()
            : null,
          resolved_on: ticket.resolved_on || null,
        }));

        setTickets(enrichedTickets);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [storedUser.username]);

  /* ================= HELPERS ================= */
  const getStatusClass = (status) => {
    switch (status) {
      case "received": return "status-received";
      case "in progress": return "status-progress";
      case "resolved": return "status-resolved";
      default: return "";
    }
  };

  const getUserName = (idOrName) => {
    if (!idOrName) return "Not Assigned";
    if (typeof idOrName === "number") {
      const user = users.find(u => u.id === idOrName);
      return user ? user.username : "Unknown";
    }
    return idOrName;
  };

  const getAssetName = (id) => {
    if (!id) return "-";
    const asset = assets.find(a => a.id === id);
    return asset ? asset.name : "-";
  };

  const formatDate = (dateStr) => (dateStr ? new Date(dateStr).toLocaleString() : "-");

  /* ================= RENDER ================= */
  return (
    <div className="ticket-page">
      <h2 className="ticket-title">Tickets</h2>

      <table className="ticket-table">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Issue</th>
            <th>Status</th>
            <th>Reported By</th>
            <th>Opened On</th>
            <th>Assigned</th>
            <th>Technician</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {tickets.length === 0 ? (
            <tr>
              <td colSpan="8" className="no-data">No tickets found</td>
            </tr>
          ) : (
            tickets.map(ticket => (
              <tr key={ticket.id}>
                <td>{getAssetName(ticket.asset)}</td>
                <td>{ticket.issue}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </td>
                <td>{getUserName(ticket.reported_by)}</td>
                <td>{formatDate(ticket.opened_on)}</td>
                <td>{formatDate(ticket.assigned_at)}</td>
                <td>{getUserName(ticket.assigned_technician)}</td>
                <td><button className="action-btn">View</button></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Ticket;
