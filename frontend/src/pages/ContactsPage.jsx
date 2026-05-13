import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

export function ContactsPage() {
  const [contacts,
    setContacts] =
    useState([]);

  const [formData,
    setFormData] =
    useState({
      email: "",
      firstName: "",
      lastName: "",
    });

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await axios.get(
          `${import.meta.env.VITE_API_URL}/api/contacts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      setContacts(
        Array.isArray(response.data)
          ? response.data
          : response.data.contacts || []
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function createContact(
    e
  ) {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem(
          "token"
        );

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/contacts`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormData({
        email: "",
        firstName: "",
        lastName: "",
      });

      fetchContacts();
    } catch (error) {
      console.log(error);

      alert(
        "Failed to create contact"
      );
    }
  }

  async function deleteContact(
    id
  ) {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/contacts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setContacts((prev) =>
        prev.filter(
          (contact) =>
            contact.id !== id
        )
      );
    } catch (error) {
      console.log(error);

      alert(
        "Failed to delete contact"
      );
    }
  }

  async function importCsv(
    e
  ) {
    const file =
      e.target.files[0];

    if (!file) return;

    try {
      const token =
        localStorage.getItem(
          "token"
        );

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/contacts/import`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert(
        "CSV Imported Successfully"
      );

      fetchContacts();
    } catch (error) {
      console.log(error);

      alert(
        "Import failed"
      );
    }
  }

  function exportCsv() {
    if (!contacts.length) {
      alert("No contacts");

      return;
    }

    const headers = [
      "email",
      "firstName",
      "lastName",
      "status",
    ];

    const rows =
      contacts.map(
        (contact) => [
          contact.email,
          contact.firstName,
          contact.lastName,
          contact.unsubscribed
            ? "Unsubscribed"
            : "Active",
        ]
      );

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.join(",")
      ),
    ].join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv",
      }
    );

    const url =
      window.URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      "contacts.csv";

    link.click();
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
        Contacts
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
        <form
          onSubmit={
            createContact
          }
          style={{
            display: "flex",
            flexDirection:
              "column",
            gap: "18px",
          }}
        >
          <input
            placeholder="Email"
            value={
              formData.email
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                email:
                  e.target
                    .value,
              })
            }
            style={inputStyle}
          />

          <input
            placeholder="First Name"
            value={
              formData.firstName
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                firstName:
                  e.target
                    .value,
              })
            }
            style={inputStyle}
          />

          <input
            placeholder="Last Name"
            value={
              formData.lastName
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                lastName:
                  e.target
                    .value,
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
            Add Contact
          </button>

          <button
            type="button"
            onClick={exportCsv}
            style={
              exportButtonStyle
            }
          >
            Export CSV
          </button>

          <div>
            <label
              htmlFor="csvUpload"
              style={
                uploadButtonStyle
              }
            >
              Import CSV
            </label>

            <input
              id="csvUpload"
              type="file"
              accept=".csv"
              onChange={
                importCsv
              }
              style={{
                display:
                  "none",
              }}
            />
          </div>
        </form>
      </div>

      <div
        style={{
          display: "grid",
          gap: "18px",
        }}
      >
        {contacts.map(
          (contact) => (
            <div
              key={
                contact.id
              }
              style={
                cardStyle
              }
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  width: "100%",
                  gap: "20px",
                }}
              >
                <div>
                  <h2>
                    {
                      contact.email
                    }
                  </h2>

                  <p>
                    {
                      contact.firstName
                    }{" "}
                    {
                      contact.lastName
                    }
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems:
                      "center",
                    gap: "14px",
                  }}
                >
                  <span
                    style={{
                      background:
                        contact.unsubscribed
                          ? "#dc2626"
                          : "#16a34a",

                      color: "white",

                      padding:
                        "8px 14px",

                      borderRadius:
                        "999px",

                      fontSize:
                        "12px",

                      fontWeight:
                        "bold",
                    }}
                  >
                    {contact.unsubscribed
                      ? "Unsubscribed"
                      : "Active"}
                  </span>

                  <button
                    onClick={() =>
                      deleteContact(
                        contact.id
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

const buttonStyle = {
  padding: "16px",
  borderRadius: "12px",
  border: "none",
  background: "#4f46e5",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
};

const exportButtonStyle = {
  background: "#059669",
  color: "white",
  border: "none",
  padding: "12px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
};

const uploadButtonStyle = {
  display: "inline-block",
  background: "#2563eb",
  color: "white",
  padding: "12px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
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
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
};