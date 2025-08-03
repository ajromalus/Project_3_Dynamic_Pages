// API endpoint URL for the architect's projects
const apiURL = "http://localhost:5678/api/works";
const categoriesURL = "http://localhost:5678/api/categories";

let jobCache = []
// Make the API call with fetch to dynamically retrieve the architect's projects. 
fetch(apiURL)
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(jobs => {
        jobCache = jobs;
        displayProjects(jobs);
    })
    .catch(error => {
        console.error("Fetch error:", error);
    });

// Make another API call to retrieve the filtered projects?
// Fetch categories using request URL
fetch(categoriesURL)
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok for categories");
        }
        return response.json();
    })
    .then(categories => {
        displayCategories(categories);
    })
    .catch(error => {
        console.error("Error fetching categories:", error);
    });
// Function to display the projects in the gallery
// Create HTML elements for each project and append them to the gallery
function displayProjects(projects) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    projects.forEach(project => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const caption = document.createElement("figcaption");

        img.src = project.imageUrl;
        img.alt = project.title;
        caption.textContent = project.title;

        figure.appendChild(img);
        figure.appendChild(caption);
        gallery.appendChild(figure);
    });
}

// Function to display categories and create filter buttons
// Create buttons for each category and append them to the categories section
function displayCategories(categories) {
    const categoriesContainer = document.querySelector(".categories");
    categoriesContainer.innerHTML = ""; 
    // Create filter buttons dynamically

    //All button to show all projects
    const allBtn = document.createElement("button");
    categoriesContainer.appendChild(allBtn);
    allBtn.dataset.id = "all"; // Set data-id to "all"
    allBtn.textContent = "All";
    allBtn.classList.add("filter-btn");

    //Buttons for each fiiltered category
    categories.forEach(category => {
        const btn = document.createElement("button");
        btn.textContent = category.name;
        btn.classList.add("filter-btn");
        btn.dataset.id = category.id;
        categoriesContainer.appendChild(btn);


    });

    //Make buttons clickable
    const allButtons = document.querySelectorAll(".filter-btn");

    allButtons.forEach(button => {
        button.addEventListener("click", () => {
            const categoryId = button.dataset.id;
            filterProjectsByCategory(categoryId);
        });
    });
}

//Filter projects by category
function filterProjectsByCategory(categoryId) {
    fetch(apiURL)
        .then(response => response.json())
        .then(projects => {
            let filteredProjects;

            if (categoryId === "all") {
                filteredProjects = projects; // Show all
            } else {
                filteredProjects = projects.filter(project => {
                    return project.categoryId == categoryId;
                });
            }

            displayProjects(filteredProjects);
        })
        .catch(error => console.error("Error filtering projects:", error));
}

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




