import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId="738465321366-1gtq2hme9sdutg6qm4qnpoq7r1654en9.apps.googleusercontent.com"
      disableOneTap   
    >
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
