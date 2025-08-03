const loginURL = "http://localhost:5678/api/users/login";

fetch(loginURL, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        email: "user@example.com",
        password: "password123"
    })
});


document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();

    // Here you would send a request to your login API
    // For now, simulate successful login
    localStorage.setItem("loggedIn", "true");
    window.location.href = "index.html";
});

document.addEventListener("DOMContentLoaded", function () {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";

    const editBar = document.getElementById("edit-bar");
    const loginLink = document.querySelector('a[href="./login.html"]');

    if (isLoggedIn) {
        // Show edit bar
        editBar.classList.remove("hidden");

        // Change "Login" to "Logout"
        loginLink.textContent = "Logout";
        loginLink.href = "#";
        loginLink.addEventListener("click", function () {
            localStorage.removeItem("loggedIn");
            location.reload();
        });
    }
});
