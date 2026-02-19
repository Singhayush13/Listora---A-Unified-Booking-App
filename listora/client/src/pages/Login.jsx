import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email || !password) {
      toast.error("Email and password are required");
      return false;
    }
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleRedirectByRole = (role) => {
    if (role === "ADMIN") navigate("/admin");
    else if (role === "PROVIDER") navigate("/provider");
    else navigate("/hotels");
  };

  const submit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });

      // Save auth based on remember me
      login(res.data, rememberMe);

      toast.success("Login successful");

      // Role-based redirect
      handleRedirectByRole(res.data.user.role);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") submit();
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="row justify-content-center mt-5 mb-5">
        <div className="col-md-4">
          <div className="card p-4 shadow-sm border-0">
            <h4 className="mb-3 fw-semibold text-center">
              Login to <span className="text-primary">Listora</span>
            </h4>

            <input
              type="email"
              className="form-control mb-3"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />

            {/* Password with toggle */}
            <div className="input-group mb-3">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>

            {/* Remember Me */}
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                id="rememberMe"
              />
              <label className="form-check-label small" htmlFor="rememberMe">
                Remember me
              </label>
            </div>

            <button
              className="btn btn-primary w-100"
              onClick={submit}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Signup Link */}
            <p className="text-center small text-muted mt-3 mb-0">
              Don’t have an account?{" "}
              <Link to="/signup" className="fw-semibold text-decoration-none">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
