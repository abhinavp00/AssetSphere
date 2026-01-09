import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config"; // optional if fetching from backend
import axios from "axios";
import "./Profile.css";

function EmpProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setError("Please login first.");
        return;
      }

      const parsedUser = JSON.parse(storedUser);

      // Only allow certain roles
      const allowedRoles = ["EMPLOYEE", "TECHNICIAN", "ADMIN"];
      if (!allowedRoles.includes(parsedUser.role)) {
        setError("Unauthorized access.");
        return;
      }

      setUser(parsedUser);

      // OPTIONAL: Fetch fresh user data from backend
      // axios.get(`${BASE_URL}/users/${parsedUser.id}/`)
      //   .then(res => setUser(res.data))
      //   .catch(err => console.error("Failed to fetch user:", err));

    } catch (err) {
      console.error(err);
      setError("Invalid user session.");
    }
  }, []);

  if (error) {
    return <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>;
  }

  if (!user) {
    return <p>Loading user profile...</p>;
  }

  return (
    <div className="card">
      <h1 className="card-title">{user.role} Profile</h1>
      <hr />

      <table className="profile-table">
        <tbody>
          <tr>
            <th>Username</th>
            <td style={{ color: "skyblue" }}>{user.username}</td>
          </tr>

          <tr>
            <th>Email</th>
            <td>{user.email}</td>
          </tr>

          <tr>
            <th>Role</th>
            <td style={{ color: "green" }}>{user.role}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default EmpProfile;
