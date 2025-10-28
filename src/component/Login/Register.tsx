import React, { useState } from "react";
import apiClient from "../../services/api";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await apiClient.post("/auth/register", {
        username,
        password,
        role,
      });

      setMessage(`✅ ${res.data.message}`);
      setTimeout(() => navigate("/login"), 1500);
    } catch (error: any) {
      const msg = error.response?.data?.error || "Gagal register user";
      setMessage(`❌ ${msg}`);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "80px auto",
        padding: "30px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        background: "white",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        🧩 Register Akun Baru
      </h2>

      {message && (
        <div
          style={{
            backgroundColor: message.startsWith("✅") ? "#dcfce7" : "#fee2e2",
            color: message.startsWith("✅") ? "#166534" : "#991b1b",
            padding: "10px",
            borderRadius: "6px",
            marginBottom: "10px",
          }}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleRegister}>
        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label>Username</label>
          <input
            type="text"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Masukkan username"
            required
          />
        </div>

        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label>Password</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password"
            required
          />
        </div>

        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label>Role</label>
          <select
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="USER">User</option>
            <option value="SUPERVISI">Supervisor</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{
            width: "100%",
            padding: "10px",
            background: "var(--primary-color)",
            border: "none",
            color: "white",
            borderRadius: "6px",
          }}
        >
          Daftar
        </button>

        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Sudah punya akun?{" "}
          <a href="/login" style={{ color: "var(--primary-color)" }}>
            Login di sini
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
