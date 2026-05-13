import {
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
  Link,
} from "react-router-dom";

export function LoginPage() {
  const navigate =
    useNavigate();

  const [formData,
    setFormData] =
    useState({
      email: "superadmin@test.com",
      password: "Password123",
    });

  const [loading,
    setLoading] =
    useState(false);

  async function handleSubmit(
    e
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const response =
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/login`,
          formData
        );

      localStorage.setItem(
        "token",
        response.data.token
      );

      navigate(
        "/dashboard"
      );
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data
          ?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }

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
        padding: "20px",
      }}
    >
      <form
        onSubmit={
          handleSubmit
        }
        style={{
          width: "100%",
          maxWidth: "420px",
          background:
            "rgba(255,255,255,0.06)",
          border:
            "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          padding: "40px",
          backdropFilter:
            "blur(12px)",
          color: "white",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            marginBottom: "30px",
            textAlign:
              "center",
          }}
        >
          Login
        </h1>

        <div
          style={{
            display: "grid",
            gap: "18px",
          }}
        >
          <input
            type="email"
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
            style={
              inputStyle
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={
              formData.password
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                password:
                  e.target
                    .value,
              })
            }
            style={
              inputStyle
            }
            required
          />

          <button
            type="submit"
            disabled={
              loading
            }
            style={
              buttonStyle
            }
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </div>
        
      </form>
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
  outline: "none",
};

const buttonStyle = {
  background: "#4f46e5",
  color: "white",
  border: "none",
  padding: "14px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px",
};
