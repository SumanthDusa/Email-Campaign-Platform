import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export function AnalyticsPage() {
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
          '${import.meta.env.VITE_API_URL}/api/analytics',
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
          minHeight: "100vh",
          display: "flex",
          justifyContent:
            "center",
          alignItems:
            "center",
          background:
            "linear-gradient(to bottom right,#020617,#1e1b4b,#0f172a)",
          color: "white",
          fontSize: "28px",
        }}
      >
        Loading Analytics...
      </div>
    );
  }

  const pieData = [
    {
      name: "Active",
      value:
        stats.activeContacts,
    },
    {
      name: "Unsubscribed",
      value:
        stats.unsubscribedContacts,
    },
  ];

  const barData = [
    {
      name: "Contacts",
      value:
        stats.totalContacts,
    },
    {
      name: "Campaigns",
      value:
        stats.totalCampaigns,
    },
    {
      name: "Lists",
      value:
        stats.totalLists,
    },
    {
      name: "Opens",
      value:
        stats.totalEmailOpens,
    },
  ];

  const COLORS = [
    "#22c55e",
    "#ef4444",
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background:
          "linear-gradient(to bottom right,#020617,#1e1b4b,#0f172a)",
        color: "white",
      }}
    >
      <h1
        style={{
          fontSize: "48px",
          marginBottom:
            "40px",
          fontWeight: "bold",
        }}
      >
        Analytics
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "24px",
          marginBottom:
            "40px",
        }}
      >
        <div style={chartCard}>
          <h2
            style={{
              marginBottom:
                "20px",
            }}
          >
            Contact Status
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={
                  90
                }
                label
              >
                {pieData.map(
                  (
                    entry,
                    index
                  ) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        COLORS[
                          index
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={chartCard}>
          <h2
            style={{
              marginBottom:
                "20px",
            }}
          >
            Platform Metrics
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart
              data={barData}
            >
              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="value"
                fill="#818cf8"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
        }}
      >
        <div style={metricCard}>
          <h3>
            Total Contacts
          </h3>

          <p style={metricNumber}>
            {
              stats.totalContacts
            }
          </p>
        </div>

        <div style={metricCard}>
          <h3>
            Campaigns
          </h3>

          <p style={metricNumber}>
            {
              stats.totalCampaigns
            }
          </p>
        </div>

        <div style={metricCard}>
          <h3>
            Contact Lists
          </h3>

          <p style={metricNumber}>
            {
              stats.totalLists
            }
          </p>
        </div>

        <div style={metricCard}>
          <h3>
            Email Opens
          </h3>

          <p style={metricNumber}>
            {
              stats.totalEmailOpens
            }
          </p>
        </div>
      </div>
    </div>
  );
}

const chartCard = {
  background:
    "rgba(255,255,255,0.06)",

  border:
    "1px solid rgba(255,255,255,0.08)",

  borderRadius: "24px",

  padding: "20px",

  backdropFilter:
    "blur(12px)",

  boxShadow:
    "0 10px 30px rgba(0,0,0,0.25)",
};

const metricCard = {
  background:
    "rgba(255,255,255,0.06)",

  border:
    "1px solid rgba(255,255,255,0.08)",

  borderRadius: "24px",

  padding: "24px",

  textAlign: "center",

  backdropFilter:
    "blur(12px)",

  boxShadow:
    "0 10px 30px rgba(0,0,0,0.25)",
};

const metricNumber = {
  fontSize: "42px",

  fontWeight: "bold",

  marginTop: "16px",

  color: "#818cf8",
};