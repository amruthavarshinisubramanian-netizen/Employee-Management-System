import { useState } from "react";

export default function Avatar({ src, name = "User", size = "md", className = "" }) {
  const [imgError, setImgError] = useState(false);

  const getInitials = (str) => {
    if (!str) return "U";
    const parts = str.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.substring(0, 2).toUpperCase();
  };

  const sizeClass = {
    sm: "avatar-sm",
    md: "avatar-md",
    lg: "avatar-lg",
    xl: "avatar-xl",
  }[size] || "avatar-md";

  const fallbackUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.replace(/\s+/g, ""))}`;

  if (imgError || !src) {
    return (
      <img
        src={fallbackUrl}
        alt={name}
        className={`avatar-img ${sizeClass} ${className}`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className={`avatar-img ${sizeClass} ${className}`}
      onError={() => setImgError(true)}
    />
  );
}
