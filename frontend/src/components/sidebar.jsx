import { Link } from "react-router-dom";

export function Sidebar() {
  function logout() {
    localStorage.removeItem(
      "token"
    );

    window.location.href =
      "/login";
  }

  return (
    <div
      style={{
        width: "260px",
        background:
          "rgba(15,23,42,0.95)",
        borderRight:
          "1px solid rgba(255,255,255,0.08)",
        padding: "30px 20px",
        color: "white",
        minHeight: "100vh",
        display: "flex",
        flexDirection:
          "column",
      }}
    >
      <h2
        style={{
          marginBottom: "40px",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        EMAIL PLATFORM
      </h2>

      <div
        style={{
          display: "grid",
          gap: "16px",
          flex: 1,
        }}
      >
        <Link
          to="/dashboard"
          style={linkStyle}
        >
          Dashboard
        </Link>

        <Link
          to="/contacts"
          style={linkStyle}
        >
          Contacts
        </Link>

        <Link
          to="/contact-lists"
          style={linkStyle}
        >
          Contact Lists
        </Link>

        <Link
          to="/campaigns"
          style={linkStyle}
        >
          Campaigns
        </Link>

        <Link
          to="/analytics"
          style={linkStyle}
        >
          Analytics
        </Link>

        <Link
          to="/templates"
          style={linkStyle}
        >
          Templates
        </Link>
      </div>

      <button
        onClick={logout}
        style={{
          background: "#dc2626",
          color: "white",
          border: "none",
          padding: "14px",
          borderRadius: "12px",
          cursor: "pointer",
          fontWeight: "bold",
          marginTop: "20px",
        }}
      >
        Logout
      </button>
    </div>
  );
}

const linkStyle = {
  textDecoration: "none",
  color: "white",
  background:
    "rgba(255,255,255,0.06)",
  padding: "14px",
  borderRadius: "12px",
  fontWeight: "500",
};