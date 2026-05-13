import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

export function ContactListsPage() {
  const [lists, setLists] =
    useState([]);

  const [contacts,
    setContacts] =
    useState([]);

  const [selectedContacts,
    setSelectedContacts] =
    useState([]);

  const [formData,
    setFormData] =
    useState({
      name: "",
      description: "",
    });

  useEffect(() => {
    fetchLists();

    fetchContacts();
  }, []);

  async function fetchLists() {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await axios.get(
          `${import.meta.env.VITE_API_URL}/api/contact-lists`,
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
        response.data
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function createList(e) {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem(
          "token"
        );

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/contact-lists`,
        {
          ...formData,

          contactIds:
            selectedContacts,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        "List created"
      );

      setFormData({
        name: "",
        description: "",
      });

      setSelectedContacts(
        []
      );

      fetchLists();
    } catch (error) {
      console.log(error);

      alert(
        "Failed to create list"
      );
    }
  }

  async function deleteList(id) {
  try {
    const token =
      localStorage.getItem(
        "token"
      );

    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/contact-lists/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setLists(
      lists.filter(
        (list) =>
          list.id !== id
      )
    );

    alert(
      "List deleted successfully"
    );
  } catch (error) {
    console.log(error);

    alert(
      error.response?.data?.message ||
        "Failed to delete list"
      );
    }
  }

  function toggleContact(id) {
    if (
      selectedContacts.includes(
        id
      )
    ) {
      setSelectedContacts(
        selectedContacts.filter(
          (contactId) =>
            contactId !== id
        )
      );
    } else {
      setSelectedContacts([
        ...selectedContacts,
        id,
      ]);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom right, #020617, #1e1b4b, #0f172a)",
        padding: "40px",
        color: "white",
      }}
    >
      <h1
        style={{
          fontSize: "48px",
          marginBottom: "30px",
        }}
      >
        Contact Lists
      </h1>

      <form
        onSubmit={createList}
        style={{
          background:
            "rgba(255,255,255,0.05)",
          padding: "30px",
          borderRadius: "24px",
          marginBottom: "40px",
          display: "grid",
          gap: "18px",
        }}
      >
        <input
          placeholder="List Name"
          value={
            formData.name
          }
          onChange={(e) =>
            setFormData({
              ...formData,
              name:
                e.target
                  .value,
            })
          }
          style={inputStyle}
        />

        <textarea
          rows={4}
          placeholder="Description"
          value={
            formData.description
          }
          onChange={(e) =>
            setFormData({
              ...formData,
              description:
                e.target
                  .value,
            })
          }
          style={inputStyle}
        />

        <div>
          <h3
            style={{
              marginBottom:
                "12px",
            }}
          >
            Select Contacts
          </h3>

          <div
            style={{
              display: "grid",
              gap: "10px",
              maxHeight:
                "300px",
              overflowY:
                "auto",
            }}
          >
            {contacts.map(
              (contact) => (
                <label
                  key={
                    contact.id
                  }
                  style={
                    contactStyle
                  }
                >
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(
                      contact.id
                    )}
                    onChange={() =>
                      toggleContact(
                        contact.id
                      )
                    }
                  />

                  <span>
                    {
                      contact.email
                    }
                  </span>
                </label>
              )
            )}
          </div>
        </div>

        <button
          type="submit"
          style={buttonStyle}
        >
          Create List
        </button>
      </form>

      <div
        style={{
          display: "grid",
          gap: "18px",
        }}
      >
        {lists.map((list) => (
          <div
            key={list.id}
            style={cardStyle}
          >
            <h2>
              {list.name}
            </h2>

            <p>
              {
                list.description
              }
            </p>

            <button
              onClick={() =>
                deleteList(
                  list.id
                )
              }
              style={
                deleteButtonStyle
              }
            >
              Delete List
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "14px",
  borderRadius: "12px",
  border:
    "1px solid #334155",
  background: "#0f172a",
  color: "white",
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

const deleteButtonStyle = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "10px 14px",
  borderRadius: "10px",
  cursor: "pointer",
  marginTop: "14px",
};

const cardStyle = {
  background:
    "rgba(255,255,255,0.05)",
  padding: "24px",
  borderRadius: "18px",
};

const contactStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  background:
    "rgba(255,255,255,0.04)",
  padding: "12px",
  borderRadius: "12px",
};