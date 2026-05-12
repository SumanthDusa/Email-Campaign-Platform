import { Link } from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import { Sidebar } from "../components/sidebar";

export function DashboardPage() {
  const [stats, setStats] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await axios.get(
          "http://localhost:5000/api/analytics",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      setStats(
        response.data
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
        }}
      >
        <Sidebar />

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",
            background:
              "linear-gradient(to bottom right,#020617,#1e1b4b,#0f172a)",
            color: "white",
            fontSize: "24px",
          }}
        >
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          background:
            "linear-gradient(to bottom right,#020617,#1e1b4b,#0f172a)",
          padding: "40px",
          color: "white",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            marginBottom: "40px",
            fontWeight: "bold",
          }}
        >
          Dashboard
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(240px,1fr))",
            gap: "24px",
          }}
        >
          <div style={cardStyle}>
            <h3>
              Total Contacts
            </h3>

            <p style={numberStyle}>
              {
                stats.totalContacts
              }
            </p>
          </div>

          <div style={cardStyle}>
            <h3>
              Active Contacts
            </h3>

            <p style={numberStyle}>
              {
                stats.activeContacts
              }
            </p>
          </div>

          <div style={cardStyle}>
            <h3>
              Unsubscribed
            </h3>

            <p style={numberStyle}>
              {
                stats.unsubscribedContacts
              }
            </p>
          </div>

          <div style={cardStyle}>
            <h3>
              Campaigns
            </h3>

            <p style={numberStyle}>
              {
                stats.totalCampaigns
              }
            </p>
          </div>

          <div style={cardStyle}>
            <h3>
              Contact Lists
            </h3>

            <p style={numberStyle}>
              {
                stats.totalLists
              }
            </p>
          </div>

          <div style={cardStyle}>
            <h3>
              Email Opens
            </h3>

            <p style={numberStyle}>
              {
                stats.totalEmailOpens
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background:
    "rgba(255,255,255,0.06)",

  border:
    "1px solid rgba(255,255,255,0.08)",

  borderRadius: "24px",

  padding: "28px",

  backdropFilter:
    "blur(12px)",

  boxShadow:
    "0 10px 30px rgba(0,0,0,0.25)",
};

const numberStyle = {
  fontSize: "42px",

  fontWeight: "bold",

  marginTop: "16px",

  color: "#818cf8",
};