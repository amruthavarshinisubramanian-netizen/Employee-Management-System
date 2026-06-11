import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    department: "",
  });

  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {
    const response = await fetch(
      `http://localhost:8080/employees/${id}`
    );

    const data = await response.json();
    setEmployee(data);
  };

  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  const confirmUpdate = window.confirm(
  "Are you sure you want to update this employee?"
  );

if (!confirmUpdate) return;
    await fetch(
      `http://localhost:8080/employees/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employee),
      }
    );

    alert("Employee Updated Successfully");
    navigate("/dashboard");
  };

  return (
    <div className="container mt-5">
      <div
        className="card p-4 shadow mx-auto"
        style={{ maxWidth: "500px" }}
      >
        <h2 className="text-center text-warning mb-4">
          Edit Employee
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            className="form-control mb-3"
            value={employee.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            className="form-control mb-3"
            value={employee.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="department"
            className="form-control mb-3"
            value={employee.department}
            onChange={handleChange}
            required
          />

          <button className="btn btn-warning w-100">
            Update Employee
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditEmployee;