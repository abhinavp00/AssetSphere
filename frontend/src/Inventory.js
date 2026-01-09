import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config"; // centralized API URL

function Inventory() {
  const [inventoryData, setInventoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newInvent, setNewInvent] = useState({ item_type: "", quantity: "", threshold: "" });
  const [editInventId, setEditInventId] = useState(null);

  /* ================= FETCH INVENTORY ================= */
  const fetchInventory = async () => {
    try {
      const response = await fetch(`${BASE_URL}/inventory/`);
      const data = await response.json();
      setInventoryData(data);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  /* ================= ADD / UPDATE ================= */
  const handleAddInvent = async () => {
    if (!newInvent.item_type || !newInvent.quantity || !newInvent.threshold) {
      alert("Please fill all fields");
      return;
    }

    const url = editInventId
      ? `${BASE_URL}/inventory/${editInventId}/`
      : `${BASE_URL}/inventory/`;

    const method = editInventId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInvent),
      });

      if (!response.ok) {
        alert("Error saving inventory");
        return;
      }

      fetchInventory(); // refresh data
      setNewInvent({ item_type: "", quantity: "", threshold: "" });
      setEditInventId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (item) => {
    setNewInvent({
      item_type: item.item_type,
      quantity: item.quantity,
      threshold: item.threshold,
    });
    setEditInventId(item.id);
    setShowForm(true);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`${BASE_URL}/inventory/${id}/`, { method: "DELETE" });

      if (!response.ok) {
        alert("Error deleting item");
        return;
      }

      fetchInventory();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  /* ================= HELPER ================= */
  const getStatus = (qty) => {
    if (qty === 0) return "Out of Stock";
    if (qty <= 5) return "Low Stock";
    return "In Stock";
  };

  const filteredInventory = inventoryData.filter(item =>
    item.item_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h1>Inventory Dashboard</h1>
      <hr />

      {/* ADD / EDIT BUTTON */}
      <button
        onClick={() => setShowForm(true)}
        style={{ ...styles.addBtn, marginBottom: "15px" }}
      >
        {editInventId ? "Edit Inventory" : "+ Add Inventory"}
      </button>

      {/* FORM */}
      {showForm && (
        <div style={styles.form}>
          <input
            placeholder="Item Type"
            value={newInvent.item_type}
            onChange={(e) => setNewInvent({ ...newInvent, item_type: e.target.value })}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newInvent.quantity}
            onChange={(e) => setNewInvent({ ...newInvent, quantity: e.target.value })}
          />
          <input
            type="number"
            placeholder="Threshold"
            value={newInvent.threshold}
            onChange={(e) => setNewInvent({ ...newInvent, threshold: e.target.value })}
          />

          <button onClick={handleAddInvent} style={styles.addBtn}>
            Save
          </button>
          <button
            onClick={() => {
              setShowForm(false);
              setEditInventId(null);
              setNewInvent({ item_type: "", quantity: "", threshold: "" });
            }}
            style={styles.cancelBtn}
          >
            Cancel
          </button>
        </div>
      )}

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search item type..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.search}
      />

      {/* SUMMARY CARDS */}
      <div style={styles.cardRow}>
        <div style={{ ...styles.card, backgroundColor: "#5f8ff1ff", color: "#fff" }}>
          <h3>Total Items</h3>
          <p>{inventoryData.length}</p>
        </div>
        <div style={{ ...styles.card, backgroundColor: "#28a745", color: "#fff" }}>
          <h3>In Stock</h3>
          <p>{inventoryData.filter(i => i.quantity > 5).length}</p>
        </div>
        <div style={{ ...styles.card, backgroundColor: "#ffc107", color: "#000" }}>
          <h3>Low / Out Stock</h3>
          <p>{inventoryData.filter(i => i.quantity <= 5).length}</p>
        </div>
      </div>

      {/* TABLE */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Item Type</th>
            <th>Quantity</th>
            <th>Threshold</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.map(item => (
            <tr key={item.id}>
              <td>{item.item_type}</td>
              <td>{item.quantity}</td>
              <td>{item.threshold}</td>
              <td
                style={{
                  color: item.quantity === 0 ? "red" : item.quantity <= 5 ? "orange" : "green",
                  fontWeight: "bold",
                }}
              >
                {getStatus(item.quantity)}
              </td>
              <td>
                <button onClick={() => handleEdit(item)} style={styles.editBtn}>Edit</button>
                <button onClick={() => handleDelete(item.id)} style={styles.deleteBtn}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { padding: "20px", background: "#f4f6f8" },
  search: { padding: "10px", width: "300px", marginBottom: "10px" },
  form: { display: "flex", gap: "10px", marginBottom: "20px" },
  addBtn: { background: "#163c87", color: "#fff", border: "none", padding: "10px 15px", cursor: "pointer", borderRadius: "4px" },
  cancelBtn: { background: "#999", color: "#fff", border: "none", padding: "10px 15px", cursor: "pointer", borderRadius: "4px" },
  editBtn: { background: "#f5f4f3ff", color: "#6ee81dff", border: "none", padding: "5px 10px", marginRight: "5px", borderRadius: "4px", cursor: "pointer" },
  deleteBtn: { background: "#f8efefff", color: "#d11212ff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" },
  cardRow: { display: "flex", gap: "20px", marginBottom: "30px" },
  card: { background: "#fff", padding: "20px", borderRadius: "8px", width: "200px" },
  table: { width: "100%", background: "#fff", borderCollapse: "collapse" },
};

export default Inventory;
