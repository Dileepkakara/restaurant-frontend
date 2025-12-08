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

const writeUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const Signup = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("admin"); // selected role
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || form.password.length < 6) {
      setError("Please enter valid details. Password must be at least 6 characters.");
      return;
    }

    const users = readUsers();
    const exists = users.some(
      (u) => u.email.toLowerCase() === form.email.toLowerCase()
    );

    if (exists) {
      setError("Email already registered. Please login.");
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name: form.name,
      email: form.email.toLowerCase(),
      password: form.password,
      role: role, // from selected button
    };

    users.push(newUser);
    writeUsers(users);

    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card p-8 border border-border rounded-xl shadow">
        
        {/* ROLE BUTTONS AREA */}
        <div className="flex mb-6 gap-2">
          <button
            onClick={() => setRole("admin")}
            className={`flex-1 py-2 rounded-lg border ${
              role === "admin"
                ? "bg-primary text-white border-primary"
                : "bg-muted text-muted-foreground border-border"
            }`}
          >
            Admin
          </button>

          <button
            onClick={() => setRole("super-admin")}
            className={`flex-1 py-2 rounded-lg border ${
              role === "super-admin"
                ? "bg-primary text-white border-primary"
                : "bg-muted text-muted-foreground border-border"
            }`}
          >
            Super Admin
          </button>
        </div>

        <h2 className="text-xl font-bold mb-3">
          {role === "admin" ? "Admin Registration" : "Super Admin Registration"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input-field w-full"
              placeholder="Full name"
            />
          </div>

          <div>
            <label className="text-xs">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="input-field w-full"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-xs">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="input-field w-full"
              placeholder="Minimum 6 characters"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </form>

        <p className="text-sm text-center mt-4 text-muted-foreground">
          Already have an account?{" "}
          <Link className="text-primary underline" to="/admin/login">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;
