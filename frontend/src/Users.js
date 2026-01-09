import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config"; // ✅ use a centralized BASE_URL
import "./Profile.css";
import "./Users.css";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users/`); // ✅ use BASE_URL
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="card">
      <h1 className="card-title">All Users</h1>
      <hr />

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="profile-table nice-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={{ color: "skyblue" }}>{user.username}</td>
                <td>{user.email}</td>
                <td style={{ color: user.role === "ADMIN" ? "red" : "green" }}>
                  {user.role}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Users;
