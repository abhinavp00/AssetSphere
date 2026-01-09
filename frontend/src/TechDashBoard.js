import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { BASE_URL } from "../config"; // ✅ centralized base URL
import EmpProfile from "./EmpProfile";
import TechTickets from "./TechTickets";
import ReportIssue from "./ReportIssue";

import "./Dashboard.css";
import "./LogDashboard.css";

function TechDash() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [tickets, setTickets] = useState([]);
  const [ticketCount, setTicketCount] = useState(0); 
  const [resolvedTickets, setResolvedTickets] = useState(0);

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const techId = Number(storedUser.id);

  const menuItems = ["Dashboard", "Tickets", "Profile"];

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.clear();
    setTickets([]);
    navigate("/");
  };

  /* ================= FETCH TICKETS ================= */
  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/tickets/`); // ✅ use BASE_URL
      const allTickets = res.data;
      setTickets(allTickets);

      // Count resolved tickets
      setResolvedTickets(allTickets.filter(t => t.status === "resolved").length);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/tickets/`); // ✅ use BASE_URL
        const activeTickets = res.data.filter(ticket => ticket.status !== "resolved");

        setTickets(activeTickets);
        setTicketCount(activeTickets.length); // ✅ store ticket count
      } catch (err) {
        console.error("Error fetching tickets:", err);
      }
    };

    fetchData();
  }, []);

  /* ================= HANDLE RESOLVE ================= */
  const handleResolvedTicket = async (ticketId) => {
    try {
      // Mark ticket as resolved in backend
      await axios.patch(`${BASE_URL}/tickets/${ticketId}/`, { // ✅ use BASE_URL
        status: "resolved",
        resolved_on: new Date().toISOString(),
      });

      // Remove resolved ticket from state
      const updatedTickets = tickets.filter(ticket => ticket.id !== ticketId);
      setTickets(updatedTickets);

      // Update resolved tickets count
      setResolvedTickets(prev => prev + 1);
    } catch (err) {
      console.error("Resolve failed:", err);
    }
  };

  /* ================= HANDLE NEW TICKET ================= */
  const handleNewTicketCreated = (newTicket) => {
    setTickets(prev => [...prev, newTicket]);
  };

  /* ================= DASHBOARD COUNTS ================= */
  // Tickets assigned to this technician
  const myTickets = tickets.filter(t => t.assigned_technician === techId);

  /* ================= RENDER CONTENT ================= */
  const renderContent = () => {
    switch (activeItem) {
      case "Dashboard":
        return (
          <div className="dash-summary">
            <div className="dash-card light-purple">
              New Jobs
              <br />
              <span>{ticketCount}</span> {/* ✅ dynamically shows tech tickets */}
              <p>Tickets assigned to you</p>
            </div>

            <div className="dash-card light-orange">
              Resolved Tickets
              <br />
              <span>{resolvedTickets}</span>
              <p>Completed tasks</p>
            </div>
          </div>
        );

      case "Tickets":
        return (
          <TechTickets
            tickets={myTickets}           // pass tickets assigned to this tech
            onResolve={handleResolvedTicket} // callback when ticket is resolved
          />
        );

      case "Report Issue":
        return <ReportIssue onTicketCreated={handleNewTicketCreated} />;

      case "Profile":
        return <EmpProfile />;

      default:
        return null;
    }
  };

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar">
        <h1 className="dash-logo">AssetSphere</h1>
        <ul className="dash-menu">
          {menuItems.map(item => (
            <li
              key={item}
              className={activeItem === item ? "dash-active" : "dash-item"}
              onClick={() => setActiveItem(item)}
            >
              {item}
            </li>
          ))}
        </ul>
        <hr />
        <div className="dash-logout" onClick={handleLogout}>Logout</div>
      </aside>

      <main className="dash-content">
        <header className="dash-header">
          <h1>
            {activeItem}
            <p>
              <sub className="dash-subtitle">
                Track • Manage • Optimize Your Tickets Efficiently!
              </sub>
            </p>
          </h1>
        </header>

        {renderContent()}

        <footer className="dash-footer">
          © 2025 AssetSphere. All rights reserved.
        </footer>
      </main>
    </div>
  );
}

export default TechDash;
