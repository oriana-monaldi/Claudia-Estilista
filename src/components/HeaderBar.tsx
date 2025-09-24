import React from "react";

interface HeaderBarProps {
  children: React.ReactNode;
}

export function HeaderBar({ children }: HeaderBarProps) {
  return (
    <div
      style={{
        textAlign: "center" as const,
        marginBottom: "20px",
        padding: "10px ",
        marginTop: "20px",
        background: "#BBA2A0",
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
