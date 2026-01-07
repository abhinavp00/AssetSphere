import React, { useState, useEffect } from "react";

function Assignment() {
  const [assets, setAssets] = useState([]);
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [newAssign, setNewAssign] = useState({
    asset: "",
    employee: ""
  });

  // Fetch assets, users, and assignments
  useEffect(() => {
    const fetchAssets = async () => {
      const res = await fetch("http://127.0.0.1:8000/api/asset/");
      const data = await res.json();
      setAssets(data);
    };

    const fetchUsers = async () => {
      const res = await fetch("http://127.0.0.1:8000/api/users/");
      const data = await res.json();
      setUsers(data);
    };

    const fetchAssignments = async () => {
      const res = await fetch("http://127.0.0.1:8000/api/assignment/");
      const data = await res.json();
      setAssignments(data);
    };

    fetchAssets();
    fetchUsers();
    fetchAssignments();
  }, []);

  // Assign asset to employee
  const handleAssign = async () => {
    if (!newAssign.asset || !newAssign.employee) {
      alert("Please select asset and employee");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/assignment/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAssign) // date_assigned will be handled by backend
      });

      if (!res.ok) {
        alert("Failed to assign asset");
        return;
      }

      const data = await res.json();
      setAssignments([...assignments, data]);
      setNewAssign({ asset: "", employee: "" });
    } catch (err) {
      console.error(err);
    }
  };

  // Return asset (update date_return)
  const handleReturn = async (assignmentId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/assignment/${assignmentId}/`, {
        method: "PATCH", // only update return date
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date_return: new Date().toISOString().split("T")[0] })
      });

      if (!res.ok) {
        alert("Failed to return asset");
        return;
      }

      const updated = await res.json();
      setAssignments(assignments.map(a => a.id === assignmentId ? updated : a));
    } catch (err) {
      console.error(err);
    }
  };
  const getAssetName = (id) => {
  const asset = assets.find(a => a.id === id);
  return asset ? asset.name : id;
};

const getUserName = (id) => {
  const user = users.find(u => u.id === id);
  return user ? user.username : id;
};

const getStatus = (assignment) => {
  return assignment.date_return ? "Returned" : "Assigned";
};

const [searchTerm, setSearchTerm] = useState("");
const filteredAssignments = assignments.filter(a => {
  const assetName = getAssetName(a.asset).toString().toLowerCase();
  const userName = getUserName(a.employee).toString().toLowerCase();
  const status = getStatus(a).toLowerCase();

  return (
    assetName.includes(searchTerm.toLowerCase()) ||
    userName.includes(searchTerm.toLowerCase()) ||
    status.includes(searchTerm.toLowerCase())
  );
});




  return (
    <div style={{ padding: "20px" }}>
      <h1>Assign Asset</h1>
      <hr />

      {/* Assignment Form */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <select
          value={newAssign.asset}
          onChange={(e) => setNewAssign({ ...newAssign, asset: e.target.value })}
        >
          <option value="">Select Asset</option>
          {assets.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>

        <select
          value={newAssign.employee}
          onChange={(e) => setNewAssign({ ...newAssign, employee: e.target.value })}
        >
          <option value="">Select Employee</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
        </select>

        <button onClick={handleAssign} style={{ padding: "10px 15px", backgroundColor: "#163c87", color: "#fff", border: "none", borderRadius: "4px" }}>
          Assign
        </button>
      </div>

      {/* Current Assignments */}
      <h2>Current Assignments</h2>
      <input
  type="text"
  placeholder="Search by asset, employee or status..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  style={{
    width: "300px",
    padding: "8px 10px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "4px"
  }}
/>

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

        <td
          style={{
            fontWeight: "bold",
            color: a.date_return ? "#6c757d" : "#28a745"
          }}
        >
          {getStatus(a)}
        </td>

        <td>{a.date_assigned}</td>
        <td>{a.date_return || "-"}</td>

        <td>
          {!a.date_return && (
            <button
              onClick={() => handleReturn(a.id)}
              style={{
                padding: "5px 10px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "4px"
              }}
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
