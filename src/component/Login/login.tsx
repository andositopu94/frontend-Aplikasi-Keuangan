// // src/components/Login.tsx
// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import apiClient from '../../services/api';


// const Login: React.FC = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await apiClient.post('/auth/login', { username, password });
//       const { token, role } = response.data;

//       localStorage.setItem('authToken', token);
//       // if (role) {
//       localStorage.setItem('userRole', role);
//       // }
//       // const from = location.state?.from?.pathname || '/';
//       navigate('/');
//     } catch (err: any) {
//       console.error('Login failed:', err);
//       setError(err.response?.data?.message || 'Login gagal');
//     }
//   };

//   return (
//     <div className="login-container">
//       <h2>Login</h2>
//       {error && <p className="error-message">{error}</p>}
//       <form onSubmit={handleLogin}>
//         <div>
//           <label htmlFor="username">Username:</label>
//           <input
//             type="text"
//             id="username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="password">Password:</label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/api";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-[380px]">
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-700">
          Login Sistem Keuangan
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 text-sm mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Masukkan username"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Masukkan password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Belum Punya Akun?{" "}
          <span onClick={() => navigate("/register")}
          className="text-blue-600 cursor-pointer hover:underline">
            DAFTAR DI SINI !
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
