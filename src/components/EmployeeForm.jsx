import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:3000/employees";

export default function EmployeeForm({ mode = "add", initialData = null }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: "",
    username: "",
    email: "",
    status: "active"
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        id: initialData.id,
        username: initialData.username || "",
        email: initialData.email || "",
        status: initialData.status || "active"
      });
    }
  }, [mode, initialData]);

  const validateSync = () => {
    const err = {};
    if (!form.username.trim()) err.username = "User name is required";
    if (!form.email.trim()) err.email = "Email is required";
    else {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(form.email.trim())) err.email = "Enter a valid email";
    }
    if (!["active", "inactive"].includes(form.status)) err.status = "Select a valid status";
    return err;
  };

  // duplicate email check (async)
  const checkDuplicateEmail = async () => {
    try {
      const res = await fetch(API);
      const list = await res.json();
      const found = list.find((e) => e.email.toLowerCase() === form.email.trim().toLowerCase());
      if (!found) return false;
      // if editing, allow same email for the same id
      if (mode === "edit" && found.id === form.id) return false;
      return true;
    } catch (err) {
      console.error("duplicate check failed", err);
      return false; // don't block if server error
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const syncErr = validateSync();
    if (Object.keys(syncErr).length > 0) {
      setErrors(syncErr);
      return;
    }

    setSubmitting(true);

    // duplicate email validation
    const isDup = await checkDuplicateEmail();
    if (isDup) {
      setErrors({ email: "Email already exists" });
      setSubmitting(false);
      return;
    }

    try {
      if (mode === "add") {
        const payload = { username: form.username.trim(), email: form.email.trim(), status: form.status };
        const res = await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to add");
        alert("Employee added");
        navigate("/");
      } else {
        const payload = { id: form.id, username: form.username.trim(), email: form.email.trim(), status: form.status };
        const res = await fetch(`${API}/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update");
        alert("Employee updated");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert("Server error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {mode === "edit" && (
        <div className="mb-3">
          <label className="form-label">ID</label>
          <input type="number" className="form-control" value={form.id} disabled />
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">User name</label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          className={`form-control ${errors.username ? "is-invalid" : ""}`}
          placeholder="Enter user name"
        />
        {errors.username && <div className="invalid-feedback">{errors.username}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className={`form-control ${errors.email ? "is-invalid" : ""}`}
          placeholder="name@example.com"
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className={`form-select ${errors.status ? "is-invalid" : ""}`}
        >
          <option value="active">active</option>
          <option value="inactive">inactive</option>
        </select>
        {errors.status && <div className="invalid-feedback">{errors.status}</div>}
      </div>

      <div className="d-flex gap-2">
        <button className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : mode === "add" ? "Add Employee" : "Save Changes"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate("/")}>Cancel</button>
      </div>
    </form>
  );
}
