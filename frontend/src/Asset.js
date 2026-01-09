import React, { useEffect, useState } from "react";
import "./Asset.css";
import { getAssets, createAsset, updateAsset, deleteAsset } from "../api";

function Asset() {
  const [assetData, setAssetData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAssetId, setEditingAssetId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [newAsset, setNewAsset] = useState({
    name: "",
    asset_type: "",
    serial_number: "",
    status: "available",
    purchase_date: "",
  });

  // Counts
  const [totalAssets, setTotalAssets] = useState(0);
  const [inUseCount, setInUseCount] = useState(0);
  const [underMaintenanceCount, setUnderMaintenanceCount] = useState(0);
  const [disposedCount, setDisposedCount] = useState(0);

  // ================= FETCH =================
  const fetchAssets = async () => {
    try {
      const res = await getAssets();
      const data = res.data;
      setAssetData(data);

      // Update counts
      setTotalAssets(data.length);
      setInUseCount(data.filter(a => a.status === "in_use").length);
      setUnderMaintenanceCount(data.filter(a => a.status === "under_maintenance").length);
      setDisposedCount(data.filter(a => a.status === "disposed").length);
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // ================= ADD / UPDATE =================
  const handleAddAsset = async () => {
    if (!newAsset.name || !newAsset.asset_type || !newAsset.serial_number || !newAsset.purchase_date) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editingAssetId) {
        await updateAsset(editingAssetId, newAsset);
      } else {
        await createAsset(newAsset);
      }

      fetchAssets();
      setNewAsset({ name: "", asset_type: "", serial_number: "", status: "available", purchase_date: "" });
      setEditingAssetId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error saving asset:", error);
      alert("Error saving asset. Check console.");
    }
  };

  // ================= EDIT =================
  const handleEdit = (asset) => {
    setNewAsset(asset);
    setEditingAssetId(asset.id);
    setShowForm(true);
  };

  // ================= DELETE =================
  const handleRemove = async (id) => {
    if (!window.confirm("Delete this asset?")) return;

    try {
      await deleteAsset(id);
      fetchAssets();
    } catch (error) {
      console.error("Error deleting asset:", error);
    }
  };

  // ================= SEARCH & PAGINATION =================
  const filteredAssets = assetData.filter(asset => {
    const search = searchTerm.toLowerCase();
    return (
      asset.name.toLowerCase().includes(search) ||
      asset.asset_type.toLowerCase().includes(search) ||
      asset.serial_number.toLowerCase().includes(search) ||
      asset.status.toLowerCase().includes(search)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const currentAssets = filteredAssets.slice(indexOfLastItem - itemsPerPage, indexOfLastItem);
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);

  return (
    <div className="asset-container">
      <div className="asset-header">
        <h2>Asset Details</h2>
        <button className="btn-add" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Asset"}
        </button>
      </div>

      {/* SEARCH */}
      <div className="asset-search">
        <input
          type="text"
          placeholder="Search by name, type, serial, or status..."
          value={searchTerm}
          onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
      </div>

      {/* CARDS */}
      <div className="asset-cards">
        <div className="asset-card total">
          <h3>Total Assets</h3>
          <p>{totalAssets}</p>
        </div>
        <div className="asset-card in-use">
          <h3>In Use</h3>
          <p>{inUseCount}</p>
        </div>
        <div className="asset-card maintenance">
          <h3>Under Maintenance</h3>
          <p>{underMaintenanceCount}</p>
        </div>
        <div className="asset-card disposed">
          <h3>Disposed</h3>
          <p>{disposedCount}</p>
        </div>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="asset-form">
          <input placeholder="Asset Name" value={newAsset.name} onChange={e => setNewAsset({ ...newAsset, name: e.target.value })} />
          <input placeholder="Asset Type" value={newAsset.asset_type} onChange={e => setNewAsset({ ...newAsset, asset_type: e.target.value })} />
          <input placeholder="Serial Number" value={newAsset.serial_number} onChange={e => setNewAsset({ ...newAsset, serial_number: e.target.value })} />
          <select value={newAsset.status} onChange={e => setNewAsset({ ...newAsset, status: e.target.value })}>
            <option value="available">Available</option>
            <option value="in_use">In Use</option>
            <option value="under_maintenance">Under Maintenance</option>
            <option value="disposed">Disposed</option>
          </select>
          <input type="date" value={newAsset.purchase_date} onChange={e => setNewAsset({ ...newAsset, purchase_date: e.target.value })} />
          <button onClick={handleAddAsset}>{editingAssetId ? "Update Asset" : "Add Asset"}</button>
        </div>
      )}

      {/* TABLE */}
      <table className="asset-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Serial</th>
            <th>Status</th>
            <th>Purchase Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentAssets.map(asset => (
            <tr key={asset.id}>
              <td>{asset.name}</td>
              <td>{asset.asset_type}</td>
              <td>{asset.serial_number}</td>
              <td>{asset.status}</td>
              <td>{asset.purchase_date}</td>
              <td>
                <button onClick={() => handleEdit(asset)}>Edit</button>
                <button onClick={() => handleRemove(asset.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>&lt;</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>&gt;</button>
      </div>
    </div>
  );
}

export default Asset;
