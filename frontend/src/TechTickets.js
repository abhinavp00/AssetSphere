import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Tickets.css";

function TechTickets({ onResolve }) {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [ticketCount, setTicketCount] = useState(0); // ✅ Ticket count state

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketRes, userRes, assetRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/tickets/"),
          axios.get("http://127.0.0.1:8000/api/users/"),
          axios.get("http://127.0.0.1:8000/api/asset/"),
        ]);

        setUsers(userRes.data);
        setAssets(assetRes.data);

        const activeTickets = ticketRes.data
          .filter(ticket => ticket.status !== "resolved")
          .map(ticket => ({
            ...ticket,
            reported_by: ticket.reported_by || storedUser.username || "Unknown",
            opened_on: ticket.opened_on || new Date().toISOString(),
            assigned_at: ticket.assigned_technician
              ? ticket.assigned_at || new Date().toISOString()
              : null,
            resolved_on: ticket.resolved_on || null,
          }));

        setTickets(activeTickets);
        setTicketCount(activeTickets.length); // ✅ update ticket count
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [storedUser.username]);

  /* ================= HELPERS ================= */
  const getUserName = (idOrName) => {
    if (!idOrName) return "Not Assigned";
    if (typeof idOrName === "number") {
      const user = users.find(u => u.id === idOrName);
      return user ? user.username : "Unknown";
    }
    return idOrName;
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
      await axios.patch(
        `http://127.0.0.1:8000/api/tickets/${ticketId}/`,
        {
          status: "resolved",
          resolved_on: new Date().toISOString(),
        }
      );

      // Remove resolved ticket from state
      const updatedTickets = tickets.filter(ticket => ticket.id !== ticketId);
      setTickets(updatedTickets);
      setTicketCount(updatedTickets.length); // ✅ update ticket count
      onResolve(ticketId); // optional callback to parent
    } catch (err) {
      console.error("Resolve failed:", err);
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="ticket-page">
      <h2 className="ticket-title">
        Tickets  {/* ✅ show ticket count */}
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
                  <button
                    className="action-btn resolve-btn"
                    onClick={() => handleResolve(ticket.id)}
                  >
                    Resolve
                  </button>
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
