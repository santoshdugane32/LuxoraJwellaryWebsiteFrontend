import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Login() {

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: "USER",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // =========================
  // HANDLE INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // LOGIN
  // =========================

  const loginUser = async (e) => {

    e.preventDefault();

    // Validation
    if (
      !loginData.email.trim() ||
      !loginData.password ||
      !loginData.role
    ) {
      alert("Please fill all fields");
      return;
    }

    try {

      setLoading(true);

      console.log("LOGIN REQUEST:", loginData);

      const response = await axios.post(
        `${API_BASE_URL}/api/users/login`,
        loginData
      );

      console.log("LOGIN RESPONSE:", response.data);

      const userData = response.data;

      // =========================
      // CHECK RESPONSE
      // =========================

      if (!userData || !userData.token) {
        alert("Login failed. Token not received.");
        return;
      }

      // =========================
      // CLEAR OLD LOGIN DATA
      // =========================

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      // =========================
      // SAVE USER
      // =========================

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      // =========================
      // SAVE JWT TOKEN
      // =========================

      localStorage.setItem(
        "token",
        userData.token
      );

      // =========================
      // UPDATE AUTH CONTEXT
      // =========================

      login(userData);

      // =========================
      // SUCCESS MESSAGE
      // =========================

      alert(
        userData.message || "Login Successful"
      );

      // =========================
      // ROLE BASED NAVIGATION
      // =========================

      if (
        userData.role &&
        userData.role.toUpperCase() === "ADMIN"
      ) {

        navigate("/admin");

      } else {

        navigate("/");

      }

    } catch (error) {

      console.error("LOGIN ERROR:", error);

      const data = error.response?.data;

      // Backend returned a String
      if (typeof data === "string") {

        alert(data);

      }

      // Backend returned { message: "..." }
      else if (data?.message) {

        alert(data.message);

      }

      // Backend returned { error: "..." }
      else if (data?.error) {

        alert(data.error);

      }

      // Unknown error
      else {

        alert(
          "Invalid Email, Password or Role"
        );

      }

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="min-h-screen bg-black flex items-center justify-center px-5 relative overflow-hidden">

      {/* =========================
          BACKGROUND GLOW
      ========================= */}

      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-yellow-500/20 blur-3xl rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-500/20 blur-3xl rounded-full"></div>


      {/* =========================
          LOGIN CARD
      ========================= */}

      <div className="relative w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[35px] p-10 shadow-2xl">

        {/* =========================
            LOGO
        ========================= */}

        <h1 className="text-5xl font-black text-center mb-3 bg-gradient-to-r from-yellow-300 to-orange-500 bg-clip-text text-transparent">

          LUXORA

        </h1>

        <p className="text-center text-gray-400 mb-10">

          Login to your luxury jewelry account

        </p>


        {/* =========================
            FORM
        ========================= */}

        <form
          className="space-y-6"
          onSubmit={loginUser}
        >

          {/* EMAIL */}

          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            placeholder="Email"
            autoComplete="email"
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-yellow-500 transition"
          />


          {/* PASSWORD */}

          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            placeholder="Password"
            autoComplete="current-password"
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-yellow-500 transition"
          />


          {/* ROLE */}

          <select
            name="role"
            value={loginData.role}
            onChange={handleChange}
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-yellow-500 transition"
          >

            <option
              value="USER"
              className="bg-black text-white"
            >
              User
            </option>

            <option
              value="ADMIN"
              className="bg-black text-white"
            >
              Admin
            </option>

          </select>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black py-4 rounded-2xl font-bold transition ${
              loading
                ? "opacity-60 cursor-not-allowed"
                : "hover:scale-[1.02]"
            }`}
          >

            {loading ? "Logging in..." : "Login"}

          </button>

        </form>


        {/* =========================
            REGISTER
        ========================= */}

        <p className="text-center text-gray-400 mt-8">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-yellow-400 hover:text-yellow-300 transition"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}