// src/pages/admin/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const USERS_KEY = "rb_users";

const readUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
};

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || form.password.length < 6) {
      setError("Please provide valid credentials (password min 6 chars).");
      return;
    }

    const users = readUsers();
    const user = users.find((u) => u.email === form.email.toLowerCase() && u.password === form.password);

    if (!user) {
      setError("Invalid email or password.");
      return;
    }

    // Simple auth state — demo only
    // Save a minimal session: userId and role
    localStorage.setItem("rb_session", JSON.stringify({ userId: user.id, role: user.role, name: user.name }));

    // Redirect based on role
    if (user.role === "super-admin") {
      navigate("/super-admin", { replace: true });
    } else {
      navigate("/admin", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Login</h2>
          <Link to="/" className="text-sm text-muted-foreground">Back</Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs block mb-1">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="input-field w-full" placeholder="you@company.com" />
          </div>

          <div>
            <label className="text-xs block mb-1">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} className="input-field w-full" placeholder="Password" />
          </div>

          {error && <div className="text-sm text-destructive">{error}</div>}

          <Button type="submit" className="w-full">Log in</Button>
        </form>

        <div className="mt-4 text-sm text-center text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/admin/signup" className="text-primary underline">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
