import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!form.name || !form.email || !form.password) {
      toast.error("All fields are required");
      return false;
    }
    if (!form.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (form.password.length < 3) {
      toast.error("Password must be at least 3 characters");
      return false;
    }
    return true;
  };

  const redirectByRole = (role) => {
    if (role === "ADMIN") navigate("/admin");
    else if (role === "PROVIDER") navigate("/provider");
    else navigate("/hotels");
  };

  const submit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      // Register
      await api.post("/auth/register", form);

      // Auto-login
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      login(res.data, true);

      toast.success("Account created successfully 🎉");

      redirectByRole(res.data.user.role);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Registration failed. Please try again."
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
              Create Your <span className="text-primary">Listora</span> Account
            </h4>

            <input
              className="form-control mb-3"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              onKeyDown={handleKeyDown}
              disabled={loading}
            />

            <input
              type="email"
              className="form-control mb-3"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              onKeyDown={handleKeyDown}
              disabled={loading}
            />

            <input
              type="password"
              className="form-control mb-3"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              onKeyDown={handleKeyDown}
              disabled={loading}
            />

            <select
              className="form-control mb-3"
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
              disabled={loading}
            >
              <option value="USER">User</option>
              <option value="PROVIDER">Provider</option>
            </select>

            <button
              className="btn btn-success w-100"
              onClick={submit}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>

            {/* Login Link */}
            <p className="text-center small text-muted mt-3 mb-0">
              Already have an account?{" "}
              <Link to="/login" className="fw-semibold text-decoration-none">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
