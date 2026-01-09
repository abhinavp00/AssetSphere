import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config"; // ✅ use BASE_URL
import "./Tickets.css";

function TechTickets({ onResolve }) {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [ticketCount, setTicketCount] = useState(0);

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  /* ================= FETCH DATA ================= */
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

        const activeTickets = ticketRes.data
          .filter(ticket => ticket.status !== "resolved");

        setTickets(activeTickets);
        setTicketCount(activeTickets.length);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  /* ================= HELPERS ================= */
  const getUserName = (id) => {
    if (!id) return "Not Assigned";
    const user = users.find(u => u.id === id);
    return user ? user.username : "Unknown";
  };

  const getAssetName = (id) => {
    const asset = assets.find(a => a.id === id);
    return asset ? asset.name : "-";
  };

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleString() : "-";

  /* ================= RESOLVE ================= */
  const handleResolve = async (ticketId) => {
    try {
      await axios.patch(`${BASE_URL}/tickets/${ticketId}/`, {
        status: "resolved",
        resolved_on: new Date().toISOString(),
      });

      const updatedTickets = tickets.filter(ticket => ticket.id !== ticketId);
      setTickets(updatedTickets);
      setTicketCount(updatedTickets.length);
      onResolve(ticketId);
    } catch (err) {
      console.error("Resolve failed:", err);
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="ticket-page">
      <h2 className="ticket-title">
        Tickets ({ticketCount})
      </h2>

      <table className="ticket-table">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Issue</th>
            <th>Status</th>
            <th>Reported By</th>
            <th>Opened On</th>
            <th>Assigned</th>
            <th>Resolved On</th>
            <th>Technician</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {tickets.length === 0 ? (
            <tr>
              <td colSpan="9" className="no-data">No tickets found</td>
            </tr>
          ) : (
            tickets.map(ticket => (
              <tr key={ticket.id}>
                <td>{getAssetName(ticket.asset)}</td>
                <td>{ticket.issue}</td>
                <td>{ticket.status}</td>
                <td>{getUserName(ticket.reported_by)}</td>
                <td>{formatDate(ticket.opened_on)}</td>
                <td>{formatDate(ticket.assigned_at)}</td>
                <td>{formatDate(ticket.resolved_on)}</td>
                <td>{getUserName(ticket.assigned_technician)}</td>
                <td>
                  {ticket.status !== "resolved" && (
                    <button
                      className="action-btn resolve-btn"
                      onClick={() => handleResolve(ticket.id)}
                    >
                      Resolve
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TechTickets;
