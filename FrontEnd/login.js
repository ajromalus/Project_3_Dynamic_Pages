const loginURL = "http://localhost:5678/api/users/login";


console.log(document.getElementById("login-form"));
document.getElementById("login-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Check for existing error message and remove it
    const existingError = document.getElementById("login-error");
    if (existingError) existingError.remove();

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("loggedIn", "true");
            window.location.href = "index.html";
        } else {
            showError("Incorrect email or password.");
        }
    } catch (error) {
        console.error("Login error:", error);
        showError("An error occurred. Please try again later.");
    }
});

function showError(message) {
    const form = document.getElementById("login-form");
    const errorMsg = document.createElement("p");
    errorMsg.id = "login-error";
    errorMsg.style.color = "red";
    errorMsg.style.marginTop = "10px";
    errorMsg.textContent = message;
    form.appendChild(errorMsg);
}


