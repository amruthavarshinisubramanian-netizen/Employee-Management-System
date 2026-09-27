export default function StatCard({ title, value, subtext, icon, color = "blue", onClick }) {
  return (
    <div
      className={`kpi-card ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      <div className="kpi-info">
        <h6>{title}</h6>
        <h3>{value ?? 0}</h3>
        {subtext && <div className="kpi-subtext">{subtext}</div>}
      </div>
      <div className={`kpi-icon-box kpi-${color}`}>{icon}</div>
    </div>
  );
}
