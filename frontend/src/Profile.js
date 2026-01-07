import React, { useEffect, useState } from "react";

import "./Profile.css";

function Profile() {
  const [adminUsers, setAdminUsers] = useState([]);

  useEffect(() => {
    const fetchAdminUsers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/users/");
        const data = await response.json();

        // Filter only ADMIN users
        const admins = data.filter(user => user.role === "ADMIN");
        setAdminUsers(admins);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchAdminUsers();
  }, []);

  return (
    <div className="card">
      <h1 className="card-title" style={{fontFamily:"-moz-initial"}}>Profile</h1>
      <hr />

      {adminUsers.length === 0 ? (
        <p>No admin users found.</p>
      ) : (
        <table className="profile-table">
          <thead>
            <tr>
            
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {adminUsers.map(user => (
              <tr key={user.id}>
                
                <td style={{color:"skyblue"}}>{user.username}</td>
                
                <td>{user.email}</td>
                <td style={{color:"red"}}>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      
    </div>
  );
}

export default Profile;
