export default function Badge({ status, type = "status" }) {
  if (!status) return null;

  const normalized = status.toLowerCase().trim();

  let badgeClass = "badge-status";
  let dotClass = "badge-status-dot";

  if (normalized === "active") {
    badgeClass += " badge-active";
  } else if (normalized === "on leave" || normalized === "leave") {
    badgeClass += " badge-leave";
  } else if (normalized === "inactive") {
    badgeClass += " badge-inactive";
  } else if (normalized === "pending") {
    badgeClass += " badge-leave";
  } else if (normalized === "approved") {
    badgeClass += " badge-active";
  } else if (normalized === "rejected") {
    return (
      <span className="badge-status" style={{ backgroundColor: "var(--danger-light)", color: "var(--danger-text)" }}>
        <span className="badge-status-dot" style={{ backgroundColor: "var(--danger)" }}></span>
        {status}
      </span>
    );
  } else {
    badgeClass += " badge-inactive";
  }

  return (
    <span className={badgeClass}>
      <span className={dotClass}></span>
      {status}
    </span>
  );
}
