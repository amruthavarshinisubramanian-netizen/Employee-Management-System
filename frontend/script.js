document.getElementById("employeeForm")
.addEventListener("submit", async function(e){

    e.preventDefault();

    const employee = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        department: document.getElementById("department").value
    };

    try{

        const response = await fetch("http://localhost:8080/employees",{

            method: "POST",

            headers:{
                "Content-Type":"application/json"
            },

            body: JSON.stringify(employee)
        });

        if(response.ok){

            alert("Employee Added Successfully!");

            document.getElementById("employeeForm").reset();

            loadEmployees(); // table refresh

        } else{

            alert("Failed to add employee");

        }

    } catch(error){

        alert("Server Error");

        console.log(error);

    }

});


// FETCH ALL EMPLOYEES

async function loadEmployees(){

    try{

        const response = await fetch("http://localhost:8080/employees");

        const employees = await response.json();

        const tableBody = document.getElementById("employeeTableBody");

        tableBody.innerHTML = "";

        employees.forEach(emp => {

            tableBody.innerHTML += `

                <tr>
                    <td>${emp.id}</td>
                    <td>${emp.name}</td>
                    <td>${emp.email}</td>
                    <td>${emp.department}</td>
                </tr>

            `;

        });

    } catch(error){

        console.log(error);

    }

}


// PAGE LOAD AAGUMBOTHU DATA SHOW AGANUM

loadEmployees();