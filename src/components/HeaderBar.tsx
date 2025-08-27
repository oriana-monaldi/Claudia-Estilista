import React from "react";

interface HeaderBarProps {
  children: React.ReactNode;
}

export function HeaderBar({ children }: HeaderBarProps) {
  return (
    <div
      style={{
        textAlign: "center" as const,
        marginBottom: "24px",
        padding: "12px 0",
        background: "#ff6b9d",
        borderRadius: "12px",
        color: "#fff",
        fontWeight: 600,
        fontSize: "18px",
        letterSpacing: "0.5px",
      }}
    >
      {children}
    </div>
  );
}
