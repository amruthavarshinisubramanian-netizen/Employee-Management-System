export default function ProgressBar({ value = 0, max = 100, height = 8, showLabel = false }) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  let barColor = "var(--primary)";
  if (percentage >= 100) {
    barColor = "var(--success)";
  } else if (percentage >= 60) {
    barColor = "var(--primary)";
  } else if (percentage >= 30) {
    barColor = "var(--info)";
  } else {
    barColor = "var(--warning)";
  }

  return (
    <div className="w-100">
      {showLabel && (
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className="small text-muted">Progress</span>
          <span className="small fw-bold">{percentage}%</span>
        </div>
      )}
      <div className="custom-progress" style={{ height: `${height}px` }}>
        <div
          className="custom-progress-bar"
          style={{ width: `${percentage}%`, backgroundColor: barColor }}
        ></div>
      </div>
    </div>
  );
}
