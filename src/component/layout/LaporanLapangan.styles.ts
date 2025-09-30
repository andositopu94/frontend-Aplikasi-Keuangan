import React from "react";

const modalOverlayStyle: React.CSSProperties={
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "600px",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
};
