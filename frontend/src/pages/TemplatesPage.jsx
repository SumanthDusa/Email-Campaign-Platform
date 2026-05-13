import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

export  function TemplatesPage() {
  const [templates,
    setTemplates] =
    useState([]);

  const [form,
    setForm] =
    useState({
      name: "",
      subject: "",
      content: "",
    });

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await axios.get(
          '${import.meta.env.VITE_API_URL}/api/templates',
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

  async function addTemplate() {
    if (
      !form.name ||
      !form.subject ||
      !form.content
    ) {
      alert(
        "Fill all fields"
      );

      return;
    }

    try {
      const token =
        localStorage.getItem(
          "token"
        );

      await axios.post(
        '${import.meta.env.VITE_API_URL}/api/templates',
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setForm({
        name: "",
        subject: "",
        content: "",
      });

      fetchTemplates();
    } catch (error) {
      console.log(error);

      alert(
        "Failed to save template"
      );
    }
  }

  async function deleteTemplate(
    id
  ) {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/templates/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTemplates((prev) =>
        prev.filter(
          (template) =>
            template.id !== id
        )
      );
    } catch (error) {
      console.log(error);

      alert(
        "Failed to delete template"
      );
    }
  }

  async function editTemplate(
    template
  ) {
    const name = prompt(
      "Template Name",
      template.name
    );

    const subject = prompt(
      "Subject",
      template.subject
    );

    const content = prompt(
      "Content",
      template.content
    );

    if (
      !name ||
      !subject ||
      !content
    ) {
      return;
    }

    try {
      const token =
        localStorage.getItem(
          "token"
        );

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/templates/${template.id}`,
        {
          name,
          subject,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTemplates();
    } catch (error) {
      console.log(error);

      alert(
        "Failed to update template"
      );
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background:
          "linear-gradient(to bottom right, #020617, #1e1b4b, #0f172a)",
        color: "white",
      }}
    >
      <h1
        style={{
          fontSize: "48px",
          marginBottom: "30px",
        }}
      >
        Templates
      </h1>

      <div
        style={{
          background:
            "rgba(255,255,255,0.05)",
          padding: "32px",
          borderRadius: "24px",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection:
              "column",
            gap: "18px",
          }}
        >
          <input
            placeholder="Template Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name:
                  e.target.value,
              })
            }
            style={inputStyle}
          />

          <input
            placeholder="Email Subject"
            value={form.subject}
            onChange={(e) =>
              setForm({
                ...form,
                subject:
                  e.target.value,
              })
            }
            style={inputStyle}
          />

          <textarea
            rows={8}
            placeholder="Email Content"
            value={form.content}
            onChange={(e) =>
              setForm({
                ...form,
                content:
                  e.target.value,
              })
            }
            style={
              textareaStyle
            }
          />

          <button
            onClick={
              addTemplate
            }
            style={
              buttonStyle
            }
          >
            Save Template
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: "20px",
        }}
      >
        {templates.map(
          (template) => (
            <div
              key={
                template.id
              }
              style={
                cardStyle
              }
            >
              <h2>
                {
                  template.name
                }
              </h2>

              <p>
                {
                  template.subject
                }
              </p>

              <div
                style={{
                  marginTop:
                    "12px",
                  whiteSpace:
                    "pre-wrap",
                }}
              >
                {
                  template.content
                }
              </div>

              <div
                style={{
                  display:
                    "flex",
                  gap: "10px",
                  marginTop:
                    "18px",
                }}
              >
                <button
                  onClick={() =>
                    editTemplate(
                      template
                    )
                  }
                  style={
                    editButtonStyle
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteTemplate(
                      template.id
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
};

const buttonStyle = {
  padding: "16px",
  borderRadius: "12px",
  border: "none",
  background: "#4f46e5",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
};

const editButtonStyle = {
  background: "#2563eb",
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
  borderRadius: "18px",
};