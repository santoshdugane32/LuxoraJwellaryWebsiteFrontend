
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserRound, Mail, LockKeyhole, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export default function Register() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  };

  const registerUser = async (e) => {
    e.preventDefault();

    if (loading) return;

    const name = user.name.trim();
    const email = user.email.trim().toLowerCase();

    if (name.length < 2) {
      setErrorMessage("Please enter a name with at least 2 characters.");
      return;
    }

    if (user.password.length < 8) {
      setErrorMessage("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await axios.post(`${API_BASE_URL}/api/users/register`, {
        name,
        email,
        password: user.password,
        role: "USER",
      });

      setSuccessMessage("Account created successfully! Redirecting to login...");

      setUser({
        name: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1000);
    } catch (error) {
      console.error("Registration failed:", error);

      const status = error.response?.status;
      const responseData = error.response?.data;

      let message = "Registration failed. Please try again.";

      if (status === 409) {
        message = "This email is already registered. Please log in.";
      } else if (status === 400) {
        message =
          typeof responseData === "string"
            ? responseData
            : responseData?.message ||
              "Invalid registration details. Please check your inputs.";
      } else if (status === 403) {
        message = "Registration is not permitted. Please contact support.";
      } else if (!error.response) {
        message = "Unable to connect to the server. Please try again.";
      }

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-black/50 py-3.5 pl-11 pr-4 text-white placeholder-gray-500 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/10";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-10 sm:px-6">
      {/* Background glow */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-yellow-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

      {/* Register card */}
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-gray-950/80 p-6 shadow-2xl shadow-yellow-500/5 backdrop-blur-2xl sm:p-9">
        {/* Brand */}
        <Link to="/" className="block text-center">
          <h1 className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-orange-500 bg-clip-text text-4xl font-black tracking-[0.18em] text-transparent sm:text-5xl">
            LUXORA
          </h1>

          <p className="mt-3 text-sm text-gray-400">
            Discover the beauty of fine jewelry.
          </p>
        </Link>

        <div className="my-7 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs uppercase tracking-[0.2em] text-yellow-500">
            Create Account
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <h2 className="text-2xl font-bold text-white">
          Join LUXORA
        </h2>

        <p className="mt-2 text-sm text-gray-400">
          Create an account to explore and shop our collection.
        </p>

        {/* Feedback */}
        {errorMessage && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="mt-5 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300"
          >
            {successMessage}
          </div>
        )}

        <form onSubmit={registerUser} className="mt-6 space-y-5">
          {/* Full name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Full Name
            </label>

            <div className="relative">
              <UserRound
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                id="name"
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                minLength={2}
                maxLength={100}
                className={inputClass}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                id="email"
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                maxLength={254}
                className={inputClass}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Password
            </label>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={user.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                autoComplete="new-password"
                minLength={8}
                maxLength={72}
                className={`${inputClass} pr-12`}
                required
                disabled={loading}
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 transition hover:text-yellow-400"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Use at least 8 characters. Follow any additional password rules
              enforced by your backend.
            </p>
          </div>

          {/* Account security note */}
          <div className="flex gap-3 rounded-xl border border-yellow-500/10 bg-yellow-500/5 p-3">
            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-yellow-400"
            />
            <p className="text-xs leading-5 text-gray-400">
              Your account will be created with standard customer access.
              Administrator access is managed separately.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 py-4 font-bold text-black shadow-lg shadow-yellow-500/10 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight size={19} />
              </>
            )}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-yellow-400 transition hover:text-yellow-300 hover:underline"
          >
            Sign in
          </Link>
        </p>

        <p className="mt-6 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} LUXORA. All rights reserved.
        </p>
      </div>
    </div>
  );
}
