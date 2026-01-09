import "../styles/dashboard.css";

export default function Topbar() {
  return (
    <div className="topbar">
      <h2>Project Dashboard</h2>

      <div className="topbar-right">
        <span className="user-badge">👤 User</span>
      </div>
    </div>
  );
}
