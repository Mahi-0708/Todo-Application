import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const token = localStorage.getItem("token");

  if (token) {
    alert("You are already logged in");
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
