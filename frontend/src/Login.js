import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config"; // ✅ import BASE_URL
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ use BASE_URL
      const response = await axios.get(`${BASE_URL}/users/`);
      const users = response.data;

      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        // Store logged-in user
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: user.id,           // store id too for later use
            username: user.username,
            email: user.email,
            role: user.role,
          })
        );

        // Role-based navigation
        switch (user.role) {
          case "ADMIN":
            navigate("/dashboard");
            break;
          case "EMPLOYEE":
            navigate("/logdash");
            break;
          case "TECHNICIAN":
            navigate("/techdash");
            break;
          default:
            setError("Unknown user role");
        }
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching user data. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-card login-form" onSubmit={handleLogin}>
        <h2 className="login-title">Login</h2>

        {error && <p className="login-error">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
