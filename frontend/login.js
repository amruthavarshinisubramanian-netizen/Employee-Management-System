document.getElementById("loginForm")
.addEventListener("submit", async function(e){

    e.preventDefault();

    const user = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    try {

        const response = await fetch("http://localhost:8080/users/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(user)

        });

        const message = await response.text();

        if(message === "Login Successful"){

            alert("Login Successful");

            localStorage.setItem("loggedInUser", user.email);

            window.location.href = "dashboard.html";

        } else {

            alert("Invalid Email or Password");

        }

    } catch(error){

        console.log(error);
        alert("Server Error");

    }

});