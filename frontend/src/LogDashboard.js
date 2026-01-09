import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { BASE_URL } from "../config"; // ✅ Use centralized BASE_URL

import Assignment from "./Assignment";
import EmpProfile from "./EmpProfile";
import Ticket from "./Ticket";
import ReportIssue from "./ReportIssue";

import "./Dashboard.css";
import "./LogDashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("Dashboard");

  // Dashboard state
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalInventory, setTotalInventory] = useState(0);
  const [myAssetsCount, setMyAssetsCount] = useState(0);
  const [activeTickets, setActiveTickets] = useState(0);
  const [resolvedTickets, setResolvedTickets] = useState(0);

  const menuItems = ["Dashboard", "Report Issue", "Assignment", "My Tickets", "Profile"];

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  /* ================= FETCH DASHBOARD DATA ================= */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/"); // redirect to login if not logged in
      return;
    }

    const user = JSON.parse(storedUser);
    const loggedUserId = user.id;

    // Fetch all assets
    const fetchAssets = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/asset/`); // ✅ use BASE_URL
        const assets = res.data;

        setTotalAssets(assets.length);

        // Assets assigned to this employee
        const myAssets = assets.filter(asset => {
          const assignedId = asset.assigned_to?.id ?? asset.assigned_to;
          return assignedId === loggedUserId;
        });
        setMyAssetsCount(myAssets.length);
      } catch (err) {
        console.error("Error fetching assets:", err);
      }
    };

    // Fetch inventory
    const fetchInventory = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/inventory/`); // ✅ use BASE_URL
        setTotalInventory(res.data.length);
      } catch (err) {
        console.error("Error fetching inventory:", err);
      }
    };

    // Fetch tickets
    const fetchTickets = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/tickets/`); // ✅ use BASE_URL
        const tickets = res.data;

        setActiveTickets(tickets.filter(t => t.status === "received" || t.status === "in progress").length);
        setResolvedTickets(tickets.filter(t => t.status === "resolved").length);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      }
    };

    fetchAssets();
    fetchInventory();
    fetchTickets();
  }, [navigate]);

  /* ================= RENDER CONTENT ================= */
  const renderContent = () => {
    switch (activeItem) {
      case "Profile":
        return <EmpProfile />;
      case "My Tickets":
        return <Ticket />;
      case "Report Issue":
        return <ReportIssue />;
      case "Assignment":
        return <Assignment />;
      default:
        return null;
    }
  };

  return (
    <div className="dash-layout">
      {/* Sidebar */}
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
        <div className="dash-logout" onClick={handleLogout}>
          Logout
        </div>
      </aside>

      {/* Main Content */}
      <main className="dash-content">
        <header className="dash-header">
          <h1>
            {activeItem} <sub>- Employee</sub>
          </h1>
          <p className="dash-subtitle">
            Track • Manage • Optimize Your Assets Effortlessly..!
          </p>
        </header>

        {/* DASHBOARD CARDS */}
        {activeItem === "Dashboard" && (
          <div className="dash-summary">
            <div className="dash-card light-blue">
              My Assets
              <span>{myAssetsCount}</span>
              <p>Assets assigned to me</p>
            </div>

            <div className="dash-card light-orange">
              Active Tickets
              <span>{activeTickets}</span>
              <p>Issues in progress</p>
            </div>

            <div className="dash-card light-green">
              Resolved Tickets
              <span>{resolvedTickets}</span>
              <p>Issues fixed</p>
            </div>
          </div>
        )}

        {renderContent()}

        <footer className="dash-footer">
          © 2025 AssetSphere. All rights reserved.
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;
