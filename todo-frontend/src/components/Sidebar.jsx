import "../styles/dashboard.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      {/* LOGO / APP NAME */}
      <h2 className="logo">TodoApp</h2>

      {/* NAVIGATION */}
      <ul className="nav-links">
        <li className="active">Dashboard</li>
        <li>My Tasks</li>
        <li>Completed</li>
      </ul>

      {/* LOGOUT */}
      <button
        className="logout-btn"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
      >
        Logout
      </button>
    </div>
  );
}
