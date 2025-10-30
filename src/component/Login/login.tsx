import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/api";
import "../Login/Login.css";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.post("/auth/login", {
        username,
        password,
      });

      const { token, username: user, role } = response.data;

      
      localStorage.setItem("authToken", token);
      localStorage.setItem("username", user);

      const normalRole = role.toUpperCase().trim();
      localStorage.setItem("userRole", normalRole);
      console.log("login berhasil", {user, normalRole});

      
      navigate("/");
    } catch (err: any) {
      console.error("Login gagal:", err);
      if (err.response?.status === 401) {
        setError("Username atau password salah!");
      } else {
        setError("Gagal login. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background dengan animasi */}
      <div className="login-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="login-card">
        {/* Header Section */}
        <div className="login-header">
          <div className="logo-container">
            <div className="logo-icon">💰</div>
            <h1 className="logo-text">FinancePro</h1>
          </div>
          <h2 className="login-title">Selamat Datang Kembali</h2>
          <p className="login-subtitle">
            Masuk ke sistem manajemen keuangan Anda
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">👤</span>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              placeholder="Masukkan username Anda"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🔒</span>
              Password
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input password-input"
                placeholder="Masukkan password Anda"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Ingat saya
            </label>
            <a href="#" className="forgot-password">
              Lupa password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                Memproses...
              </>
            ) : (
              <>
                <span className="button-icon">🚀</span>
                Masuk ke Sistem
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <p className="footer-text">
            © 2024 FinancePro. All rights reserved.
          </p>
          <div className="security-badge">
            <span className="security-icon">🛡️</span>
            Sistem Terenkripsi
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="features-sidebar">
        <h3 className="features-title">Mengapa FinancePro?</h3>
        <div className="feature-list">
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <div className="feature-content">
              <h4>Laporan Real-time</h4>
              <p>Pantau keuangan Anda secara langsung</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔒</span>
            <div className="feature-content">
              <h4>Keamanan Terjamin</h4>
              <p>Data Anda dilindungi dengan enkripsi</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">💼</span>
            <div className="feature-content">
              <h4>Manajemen Lengkap</h4>
              <p>Kelola semua transaksi dalam satu platform</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📱</span>
            <div className="feature-content">
              <h4>Responsif</h4>
              <p>Akses dari perangkat apapun</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
