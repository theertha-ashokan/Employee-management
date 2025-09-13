import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = "http://localhost:3000/employees";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await fetch(API);
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to fetch employees from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete employee.");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Employees</h2>
        <Link className="btn btn-success" to="/add">Add Employee</Link>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : employees.length === 0 ? (
        <div className="alert alert-info">No employees found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>User name</th>
                <th>Email</th>
                <th>Status</th>
                <th style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.username}</td>
                  <td>{e.email}</td>
                  <td>
                    <span className={`badge ${e.status === "active" ? "bg-success" : "bg-secondary"}`}>
                      {e.status}
                    </span>
                  </td>
                  <td>
                    <Link to={`/edit/${e.id}`} className="btn btn-primary btn-sm me-2">Edit</Link>
                    <button onClick={() => handleDelete(e.id)} className="btn btn-danger btn-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
