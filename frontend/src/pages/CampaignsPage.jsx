import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

export function CampaignsPage() {
  const [campaigns,
    setCampaigns] =
    useState([]);

  const [lists, setLists] =
    useState([]);

  const [templates,
    setTemplates] =
    useState([]);

  const [formData,
    setFormData] =
    useState({
      name: "",
      subject: "",
      content: "",
      contactListId: "",
      templateId: "",
      scheduledAt: "",
    });

  useEffect(() => {
    fetchCampaigns();

    fetchLists();

    fetchTemplates();
  }, []);

  async function fetchCampaigns() {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await axios.get(
          "${import.meta.env.VITE_API_URL}/api/campaigns",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      setCampaigns(
        response.data
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchLists() {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await axios.get(
          "http://localhost:5000/api/contact-lists",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      setLists(
        response.data.data ||
          response.data
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchTemplates() {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await axios.get(
          "http://localhost:5000/api/templates",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      setTemplates(
        response.data
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function createCampaign(
    e
  ) {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem(
          "token"
        );

      await axios.post(
        "http://localhost:5000/api/campaigns",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        "Campaign created successfully"
      );

      setFormData({
        name: "",
        subject: "",
        content: "",
        contactListId: "",
        templateId: "",
        scheduledAt: "",
      });

      fetchCampaigns();
    } catch (error) {
      console.log(error);

      alert(
        "Failed to create campaign"
      );
    }
  }

  async function sendCampaign(
    id
  ) {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      await axios.post(
        `http://localhost:5000/api/campaigns/${id}/send`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        "Campaign sent successfully"
      );

      fetchCampaigns();
    } catch (error) {
      console.log(error);

      alert(
        "Failed to send campaign"
      );
    }
  }

  async function deleteCampaign(
    id
  ) {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      await axios.delete(
        `http://localhost:5000/api/campaigns/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCampaigns((prev) =>
        prev.filter(
          (campaign) =>
            campaign.id !== id
        )
      );

      alert(
        "Campaign deleted"
      );
    } catch (error) {
      console.log(error);

      alert(
        "Failed to delete campaign"
      );
    }
  }

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
            "30px",
        }}
      >
        Campaigns
      </h1>

      <form
        onSubmit={
          createCampaign
        }
        style={{
          background:
            "rgba(255,255,255,0.05)",
          padding: "30px",
          borderRadius:
            "24px",
          marginBottom:
            "40px",
          display: "grid",
          gap: "18px",
        }}
      >
        <input
          type="text"
          placeholder="Campaign Name"
          value={
            formData.name
          }
          onChange={(e) =>
            setFormData({
              ...formData,
              name:
                e.target.value,
            })
          }
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Subject"
          value={
            formData.subject
          }
          onChange={(e) =>
            setFormData({
              ...formData,
              subject:
                e.target.value,
            })
          }
          style={inputStyle}
        />

        <select
          value={
            formData.templateId
          }
          onChange={(e) => {
            const selectedTemplate =
              templates.find(
                (template) =>
                  template.id ===
                  e.target.value
              );

            setFormData({
              ...formData,

              templateId:
                e.target.value,

              content:
                selectedTemplate
                  ?.content ||
                "",
            });
          }}
          style={inputStyle}
        >
          <option value="">
            Select Template
          </option>

          {templates.map(
            (template) => (
              <option
                key={
                  template.id
                }
                value={
                  template.id
                }
              >
                {template.name}
              </option>
            )
          )}
        </select>

        <textarea
          placeholder="Email Content"
          rows={8}
          value={
            formData.content
          }
          onChange={(e) =>
            setFormData({
              ...formData,
              content:
                e.target.value,
            })
          }
          style={
            textareaStyle
          }
        />

        <select
          value={
            formData.contactListId
          }
          onChange={(e) =>
            setFormData({
              ...formData,
              contactListId:
                e.target.value,
            })
          }
          style={inputStyle}
        >
          <option value="">
            Select Contact
            List
          </option>

          {lists.map(
            (list) => (
              <option
                key={list.id}
                value={list.id}
              >
                {list.name}
              </option>
            )
          )}
        </select>

        <input
          type="datetime-local"
          value={
            formData.scheduledAt
          }
          onChange={(e) =>
            setFormData({
              ...formData,
              scheduledAt:
                e.target.value,
            })
          }
          style={inputStyle}
        />

        <button
          type="submit"
          style={
            buttonStyle
          }
        >
          Create Campaign
        </button>
      </form>

      <div
        style={{
          display: "grid",
          gap: "20px",
        }}
      >
        {campaigns.map(
          (campaign) => (
            <div
              key={campaign.id}
              style={cardStyle}
            >
              <div>
                <h2>
                  {
                    campaign.name
                  }
                </h2>

                <p>
                  Subject:{" "}
                  {
                    campaign.subject
                  }
                </p>

                <p>
                  Status:{" "}
                  {
                    campaign.status
                  }
                </p>

                <p>
                  Emails Sent:{" "}
                  {
                    campaign.emailsSent
                  }
                </p>

                <p>
                  Opens:{" "}
                  {
                    campaign.opens
                  }
                </p>

                {campaign.scheduledAt && (
                  <p>
                    Scheduled:
                    {" "}
                    {new Date(
                      campaign.scheduledAt
                    ).toLocaleString()}
                  </p>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                }}
              >
                {campaign.status !==
                  "completed" && (
                  <button
                    onClick={() =>
                      sendCampaign(
                        campaign.id
                      )
                    }
                    style={
                      sendButtonStyle
                    }
                  >
                    Send
                  </button>
                )}

                <button
                  onClick={() =>
                    deleteCampaign(
                      campaign.id
                    )
                  }
                  style={
                    deleteButtonStyle
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border:
    "1px solid #334155",
  background: "#0f172a",
  color: "white",
};

const textareaStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border:
    "1px solid #334155",
  background: "#0f172a",
  color: "white",
  resize: "vertical",
};

const buttonStyle = {
  background: "#4f46e5",
  color: "white",
  border: "none",
  padding: "14px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
};

const sendButtonStyle = {
  background: "#16a34a",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer",
};

const deleteButtonStyle = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer",
};

const cardStyle = {
  background:
    "rgba(255,255,255,0.05)",
  padding: "24px",
  borderRadius: "20px",
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  border:
    "1px solid rgba(255,255,255,0.08)",
};
