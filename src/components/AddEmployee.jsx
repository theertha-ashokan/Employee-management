import React from "react";
import EmployeeForm from "./EmployeeForm";

export default function AddEmployee() {
  return (
    <div>
      <h2>Add Employee</h2>
      <EmployeeForm mode="add" />
    </div>
  );
}
