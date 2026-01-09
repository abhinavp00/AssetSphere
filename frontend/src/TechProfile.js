import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config"; // ✅ use BASE_URL
import "./Profile.css";

function TechProfile() {
  const [tech, setTech] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTech = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setError("Please login first.");
          return;
        }

        const parsedUser = JSON.parse(storedUser);

        // Only allow TECHNICIAN role
        if (parsedUser.role !== "TECHNICIAN") {
          setError("Unauthorized access.");
          return;
        }

        // Fetch technician data from backend
        const res = await fetch(`${BASE_URL}/users/${parsedUser.id}/`);
        if (!res.ok) {
          throw new Error("Failed to fetch technician data");
        }

        const data = await res.json();
        setTech(data);
      } catch (err) {
        console.error(err);
        setError("Error fetching technician data");
      }
    };

    fetchTech();
  }, []);

  if (error) return <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>;
  if (!tech) return <p>Loading technician profile...</p>;

  return (
    <div className="card">
      <h1 className="card-title">{tech.role} Profile</h1>
      <hr />
      <table className="profile-table">
        <tbody>
          <tr>
            <th>Username</th>
            <td style={{ color: "skyblue" }}>{tech.username}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{tech.email}</td>
          </tr>
          <tr>
            <th>Role</th>
            <td style={{ color: "green" }}>{tech.role}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TechProfile;
