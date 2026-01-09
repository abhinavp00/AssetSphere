import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AssetStatusChart from "./AssetStatusChart";
import InventoryStatusChart from "./InventoryStatusChart";
import Asset from "./Asset";
import Inventory from "./Inventory";
import Profile from "./Profile";
import Users from "./Users";
import Assignment from "./Assignment";
import Ticket from "./Ticket";

import { getAssets, getInventory, getTickets } from "../api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("Dashboard");

  // ===== ASSETS =====
  const [totalAssets, setTotalAssets] = useState(0);
  const [inUseCount, setInUseCount] = useState(0);
  const [underMaintenanceCount, setUnderMaintenanceCount] = useState(0);
  const [disposedCount, setDisposedCount] = useState(0);

  // ===== INVENTORY =====
  const [totalInventory, setTotalInventory] = useState(0);

  // ===== TICKETS =====
  const [ticketCount, setTicketCount] = useState(0);
  const [resolvedTickets, setResolvedTickets] = useState(0);

  // ===== RECENT ACTIVITY =====
  const [activities, setActivities] = useState([]);

  const menuItems = ["Dashboard", "Asset", "Inventory", "Assignment", "Tickets", "Users", "Profile"];

  const handleLogout = () => navigate("/");

  /* ================= FETCH DASHBOARD DATA ================= */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // ---------- ASSETS ----------
        const assetRes = await getAssets();
        const assets = assetRes.data;

        setTotalAssets(assets.length);
        setInUseCount(assets.filter(a => a.status === "in_use").length);
        setUnderMaintenanceCount(assets.filter(a => a.status === "under_maintenance").length);
        setDisposedCount(assets.filter(a => a.status === "disposed").length);

        // ---------- INVENTORY ----------
        const inventoryRes = await getInventory();
        setTotalInventory(inventoryRes.data.length);

        // ---------- TICKETS ----------
        const ticketRes = await getTickets();
        const tickets = ticketRes.data;

        const openTickets = tickets.filter(t => t.status !== "resolved").length;
        const resolved = tickets.filter(t => t.status === "resolved").length;

        setTicketCount(openTickets);
        setResolvedTickets(resolved);

        // ---------- RECENT ACTIVITY ----------
        const recent = [];

        tickets.slice(-3).forEach(t => {
          recent.push({
            id: `ticket-${t.id}`,
            message: t.status === "resolved" ? `Ticket #${t.id} resolved` : `New ticket #${t.id} created`,
            time: t.updated_at || t.created_at || new Date(),
          });
        });

        assets.slice(-2).forEach(a => {
          recent.push({
            id: `asset-${a.id}`,
            message: `Asset "${a.name}" updated`,
            time: a.updated_at || a.created_at || new Date(),
          });
        });

        recent.sort((a, b) => new Date(b.time) - new Date(a.time));
        setActivities(recent.slice(0, 5));
      } catch (error) {
        console.error("Dashboard fetch failed:", error);
      }
    };

    fetchDashboardData();
  }, []);

  /* ================= RENDER CONTENT ================= */
  const renderContent = () => {
    switch (activeItem) {
      case "Asset": return <Asset />;
      case "Inventory": return <Inventory />;
      case "Assignment": return <Assignment />;
      case "Tickets": return <Ticket />;
      case "Users": return <Users />;
      case "Profile": return <Profile />;
      default: return null;
    }
  };

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h1 className="sidebar-logo">AssetSphere</h1>
        <ul className="sidebar-menu">
          {menuItems.map(item => (
            <li
              key={item}
              className={activeItem === item ? "active" : ""}
              onClick={() => setActiveItem(item)}
            >
              {item}
            </li>
          ))}
        </ul>
        <hr />
        <div className="sidebar-logout" onClick={handleLogout}>Logout</div>
      </aside>

      {/* MAIN */}
      <main className="dashboard-content">
        <header className="dashboard-header"><h1>{activeItem}</h1></header>

        {activeItem === "Dashboard" && (
          <>
            {/* SUMMARY CARDS */}
            <div className="dashboard-summary">
              <div className="summary-card">Total Assets <span>{totalAssets}</span></div>
              <div className="summary-card">Total Inventory <span>{totalInventory}</span></div>
              <div className="summary-card">Assigned Assets <span>{inUseCount}</span></div>
              <div className="summary-card">Open Tickets <span>{ticketCount}</span></div>
            </div>

            {/* CHARTS */}
            <div className="dashboard-charts chart-box">
              <section className="chart-section">
                <h2>Assets Overview</h2>
                <AssetStatusChart
                  total={totalAssets}
                  inUse={inUseCount}
                  underMaintenance={underMaintenanceCount}
                  disposed={disposedCount}
                />
              </section>

              <section className="chart-section">
                <h2>Tickets Status</h2>
                <InventoryStatusChart
                  ticketCount={ticketCount}
                  resolvedTickets={resolvedTickets}
                />
              </section>
            </div>

            {/* RECENT ACTIVITY */}
            <section className="recent-activity">
              <h2>Recent Activity</h2>
              {activities.length === 0 ? (
                <p className="no-activity">No recent activity</p>
              ) : (
                <ul className="activity-list">
                  {activities.map(a => (
                    <li key={a.id} className="activity-item">
                      <span>{a.message}</span>
                      <small>{new Date(a.time).toLocaleString()}</small>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}

        {renderContent()}

        <footer className="dashboard-footer">
          © 2025 AssetSphere. All rights reserved.
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;
