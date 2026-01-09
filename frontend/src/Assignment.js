import React, { useState, useEffect } from "react";
import { getAssets, getUsers, getAssignments, createAssignment, updateAssignment } from "../api";

function Assignment() {
  const [assets, setAssets] = useState([]);
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [newAssign, setNewAssign] = useState({ asset: "", employee: "" });
  const [searchTerm, setSearchTerm] = useState("");

  // ================= FETCH =================
  const fetchAll = async () => {
    try {
      const [assetRes, userRes, assignmentRes] = await Promise.all([
        getAssets(),
        getUsers(),
        getAssignments()
      ]);

      setAssets(assetRes.data);
      setUsers(userRes.data);
      setAssignments(assignmentRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ================= ASSIGN ASSET =================
  const handleAssign = async () => {
    if (!newAssign.asset || !newAssign.employee) {
      alert("Please select asset and employee");
      return;
    }

    try {
      const res = await createAssignment(newAssign);
      setAssignments([...assignments, res.data]);
      setNewAssign({ asset: "", employee: "" });
    } catch (error) {
      console.error("Error assigning asset:", error);
      alert("Failed to assign asset");
    }
  };

  // ================= RETURN ASSET =================
  const handleReturn = async (assignmentId) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await updateAssignment(assignmentId, { date_return: today });
      setAssignments(assignments.map(a => (a.id === assignmentId ? res.data : a)));
    } catch (error) {
      console.error("Error returning asset:", error);
      alert("Failed to return asset");
    }
  };

  // ================= HELPERS =================
  const getAssetName = (id) => assets.find(a => a.id === id)?.name || id;
  const getUserName = (id) => users.find(u => u.id === id)?.username || id;
  const getStatus = (a) => (a.date_return ? "Returned" : "Assigned");

  // ================= SEARCH =================
  const filteredAssignments = assignments.filter(a => {
    const assetName = getAssetName(a.asset).toLowerCase();
    const userName = getUserName(a.employee).toLowerCase();
    const status = getStatus(a).toLowerCase();
    const search = searchTerm.toLowerCase();
    return assetName.includes(search) || userName.includes(search) || status.includes(search);
  });

  // ================= RENDER =================
  return (
    <div style={{ padding: "20px" }}>
      <h1>Assign Asset</h1>
      <hr />

      {/* Assignment Form */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <select
          value={newAssign.asset}
          onChange={e => setNewAssign({ ...newAssign, asset: e.target.value })}
        >
          <option value="">Select Asset</option>
          {assets.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>

        <select
          value={newAssign.employee}
          onChange={e => setNewAssign({ ...newAssign, employee: e.target.value })}
        >
          <option value="">Select Employee</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
        </select>

        <button
          onClick={handleAssign}
          style={{ padding: "10px 15px", backgroundColor: "#163c87", color: "#fff", border: "none", borderRadius: "4px" }}
        >
          Assign
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by asset, employee or status..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{
          width: "300px",
          padding: "8px 10px",
          marginBottom: "15px",
          border: "1px solid #ccc",
          borderRadius: "4px"
        }}
      />

      {/* Assignments Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #ccc" }}>
            <th>Asset</th>
            <th>Employee</th>
            <th>Status</th>
            <th>Date Assigned</th>
            <th>Date Returned</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredAssignments.map(a => (
            <tr key={a.id} style={{ borderBottom: "1px solid #eee" }}>
              <td>{getAssetName(a.asset)}</td>
              <td>{getUserName(a.employee)}</td>
              <td style={{ fontWeight: "bold", color: a.date_return ? "#6c757d" : "#28a745" }}>
                {getStatus(a)}
              </td>
              <td>{a.date_assigned}</td>
              <td>{a.date_return || "-"}</td>
              <td>
                {!a.date_return && (
                  <button
                    onClick={() => handleReturn(a.id)}
                    style={{ padding: "5px 10px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "4px" }}
                  >
                    Return
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Assignment;
