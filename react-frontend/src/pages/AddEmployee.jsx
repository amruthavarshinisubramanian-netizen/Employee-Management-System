import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddEmployee() {
  const navigate = useNavigate();

  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    department: "",
  });

  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:8080/employees/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employee),
    });

    alert("Employee Added Successfully");
    navigate("/dashboard");
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow mx-auto" style={{ maxWidth: "500px" }}>
        <h2 className="text-center text-success mb-4">
          Add Employee
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            className="form-control mb-3"
            placeholder="Employee Name"
            value={employee.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            className="form-control mb-3"
            placeholder="Employee Email"
            value={employee.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="department"
            className="form-control mb-3"
            placeholder="Department"
            value={employee.department}
            onChange={handleChange}
            required
          />

          <button className="btn btn-success w-100">
            Save Employee
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddEmployee;