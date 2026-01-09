import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/auth.css";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  //  Email / Password Login
  const submit = async () => {
    setError("");

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* LEFT PANEL */}
        <div className="auth-left">
          <h2>Hello, Friend!</h2>
          <p>
            Enter your personal details <br />
            and start your journey with us
          </p>
          <button className="ghost-btn" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div className="auth-right">
          <h2>Login</h2>

          {error && <p className="error">{error}</p>}

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

          <button onClick={submit}>Login</button>

          {/* OR DIVIDER */}
          <div className="or-divider">
            <span>OR</span>
          </div>

          {/* GOOGLE LOGIN */}
          <div className="google-wrapper">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const res = await api.post("/auth/google", {
                    token: credentialResponse.credential, //  ID TOKEN
                  });
                  localStorage.setItem("token", res.data.token);
                  navigate("/dashboard");
                } catch {
                  alert("Google login failed");
                }
              }}
              onError={() => alert("Google login failed")}
              useOneTap={false} //  no auto popup
            />
          </div>
        </div>
      </div>
    </div>
  );
}
