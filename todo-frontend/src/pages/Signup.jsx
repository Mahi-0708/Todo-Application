import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/auth.css";

export default function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");

    if (!username || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      await api.post("/auth/signup", {
        username,
        email,
        password,
      });

      alert("Signup successful! Please login");
      navigate("/");
    } catch (err) {
      if (err.response && err.response.data) {
        const msg = err.response.data.message || err.response.data;

        if (msg.toLowerCase().includes("username")) {
          setError("Username already exists");
        } else if (msg.toLowerCase().includes("email")) {
          setError("Email already exists");
        } else {
          setError("User already exists. Please login.");
        }
      } else {
        setError("Something went wrong. Try again.");
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        {/* LEFT */}
        <div className="auth-left">
          <h2>Welcome Back!</h2>
          <p>
            To keep connected with us<br />
            please login with your personal info
          </p>
          <button className="ghost-btn" onClick={() => navigate("/")}>
            Login
          </button>
        </div>

        {/* RIGHT */}
        <div className="auth-right">
          <h2>Create Account</h2>

          <p className="small-text"> use your email for registration</p>

          {error && <p className="error">{error}</p>}

          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={submit}>Sign Up</button>
        </div>
      </div>
    </div>
  );
}
