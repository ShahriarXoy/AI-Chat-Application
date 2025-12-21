import React from "react";

function StatusIndicator({
  status,
  delivered,
  seen,
  read,
  size = 13,
  tone = "dark",
  showText = true, // ✅ default true so text shows
}) {
  const normalizedStatus = (() => {
    const s = String(status || "").toLowerCase();
    if (s === "read" || s === "seen") return "seen";
    if (s === "delivered") return "delivered";
    if (s === "sent") return "sent";

    if (seen === true || read === true) return "seen";
    if (delivered === true) return "delivered";
    return "sent";
  })();

  const color = (() => {
    if (tone === "light") return normalizedStatus === "seen" ? "#2563eb" : "#6b7280";
    return normalizedStatus === "seen" ? "#93c5fd" : "rgba(255, 255, 255, 0.9)";
  })();

  const Check = ({ opacity = 1 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity, display: "block" }}
      aria-hidden="true"
    >
      <path
        d="M20 6L9 17L4 12"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const DoubleCheck = () => (
    <span style={{ display: "inline-flex", alignItems: "center" }}>
      <Check opacity={0.95} />
      <span style={{ marginLeft: "-7px" }}>
        <Check opacity={0.95} />
      </span>
    </span>
  );

  const label =
    normalizedStatus === "seen"
      ? "Seen"
      : normalizedStatus === "delivered"
        ? "Delivered"
        : "Sent";

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }} title={label}>
      {normalizedStatus === "sent" ? <Check /> : <DoubleCheck />}
      {showText && (
        <span style={{ fontSize: "0.72em", color, lineHeight: 1 }}>{label}</span>
      )}
    </span>
  );
}

export default StatusIndicator;
