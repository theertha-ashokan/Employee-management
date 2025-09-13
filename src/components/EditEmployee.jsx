import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EmployeeForm from "./EmployeeForm";

export default function EditEmployee() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOne = async () => {
      try {
        const res = await fetch(`http://localhost:3000/employees/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setInitialData(data);
      } catch (err) {
        console.error(err);
        setInitialData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOne();
  }, [id]);

  if (loading) return <div>Loading employee...</div>;
  if (!initialData) return <div className="alert alert-danger">Employee not found</div>;

  return (
    <div>
      <h2>Edit Employee #{id}</h2>
      <EmployeeForm mode="edit" initialData={initialData} />
    </div>
  );
}
