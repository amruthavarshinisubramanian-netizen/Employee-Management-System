document.getElementById("registerForm")
.addEventListener("submit", async function(e){

    e.preventDefault();

    const user = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    try {

        const response = await fetch("http://localhost:8080/users/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(user)

        });

        if(response.ok){

            alert("Registration Successful!");

            window.location.href = "login.html";

        } else {

            alert("Registration Already Exists!");

        }

    } catch(error){

        console.log(error);
        alert("Server Error");

    }

});