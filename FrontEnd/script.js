// API endpoints
const apiURL = "http://localhost:5678/api/works";
const categoriesURL = "http://localhost:5678/api/categories";

let jobCache = []; // store fetched projects

// DOM Elements
const gallery = document.querySelector(".gallery");
const categoriesContainer = document.querySelector(".categories");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const openModalBtn = document.querySelector(".btn-open");
const closeModalBtn = document.querySelector(".btn-close");

// ======================
// FETCH PROJECTS
// ======================
fetch(apiURL)
    .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
    })
    .then(jobs => {
        jobCache = jobs;
        displayProjects(jobs); // show in main gallery

        // Attach modal loader now that projects exist
        openModalBtn.addEventListener("click", () => {
            loadProjectsIntoModal();
            openModal();
        });
    })
    .catch(error => console.error("Fetch error:", error));

// ======================
// FETCH CATEGORIES
// ======================
fetch(categoriesURL)
    .then(response => {
        if (!response.ok) throw new Error("Network response was not ok for categories");
        return response.json();
    })
    .then(categories => {
        displayCategories(categories);
    })
    .catch(error => console.error("Error fetching categories:", error));

// ======================
// DISPLAY PROJECTS
// ======================
function displayProjects(projects) {
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

// ======================
// DISPLAY CATEGORIES
// ======================
function displayCategories(categories) {
    categoriesContainer.innerHTML = "";

    // All button
    const allBtn = document.createElement("button");
    allBtn.textContent = "All";
    allBtn.classList.add("filter-btn");
    allBtn.dataset.id = "all";
    categoriesContainer.appendChild(allBtn);

    // Individual category buttons
    categories.forEach(category => {
        const btn = document.createElement("button");
        btn.textContent = category.name;
        btn.classList.add("filter-btn");
        btn.dataset.id = category.id;
        categoriesContainer.appendChild(btn);
    });

    // Button click events
    const allButtons = document.querySelectorAll(".filter-btn");
    allButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterProjectsByCategory(button.dataset.id);
        });
    });

    // Populate dropdown in modal
    const categorySelect = document.getElementById("category");
    if (categorySelect) {
        categorySelect.innerHTML = "";
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    }

}

// ======================
// FILTER PROJECTS
// ======================
function filterProjectsByCategory(categoryId) {
    let filteredProjects;

    if (categoryId === "all") {
        filteredProjects = jobCache;
    } else {
        filteredProjects = jobCache.filter(project => project.categoryId == categoryId);
    }

    displayProjects(filteredProjects);
}

// ======================
// MODAL FUNCTIONALITY
// ======================
function loadProjectsIntoModal() {
    const container = document.getElementById("modal-projects");
    container.innerHTML = "";

    jobCache.forEach(job => {
        const projectDiv = document.createElement("div");
        projectDiv.classList.add("project-item");
        projectDiv.dataset.id = job.id; // For deletion reference
        projectDiv.innerHTML = `
      <img class="modal-images" src="${job.imageUrl}" alt="${job.title}">
      <button class="btn-trash">
		<img class="delete-icon" src="./assets/icons/Trash.png" alt="Delete Icon">
	  </button>
      
    `;
        container.appendChild(projectDiv);
    });

    setupDeleteButtons(); // Attach delete functionality
}

function openModal() {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
}

function closeModal() {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
    modalForm.classList.add("hidden");
    modalGallery.classList.remove("hidden");

    document.querySelector(".back-button").classList.add("hidden");
}

closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
    }
});

// ======================
// EDIT BAR FOR LOGGED-IN USERS
// ======================
document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    const editBar = document.getElementById("edit-bar");
    const categoryWrapper = document.getElementById("category-container");
    const loginLink = document.querySelector('a[href="./login.html"]');
    const editToggle = document.querySelector(".edit-toggle");

    if (isLoggedIn) {
        if (editBar) editBar.classList.remove("hidden");
        if (categoryWrapper) categoryWrapper.classList.add("hidden");
        if (editToggle) editToggle.classList.remove("hidden");

        loginLink.textContent = "Logout";
        loginLink.href = "#";
        loginLink.addEventListener("click", () => {
            localStorage.removeItem("loggedIn");
            localStorage.removeItem("token");
            location.reload();
        });
    }
});

// ======================
// DELETE PROJECT (MODAL)
// ======================

function setupDeleteButtons() {
    const deleteButtons = document.querySelectorAll(".btn-trash");

    deleteButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();

            const projectDiv = e.target.closest(".project-item");
            const jobId = projectDiv.dataset.id;

            deleteJob(jobId, projectDiv);
        });
    });
}

// Create deleteJob() Function

function deleteJob(jobId, projectDiv) {
    const token = localStorage.getItem("token"); // authentication token

    fetch(`http://localhost:5678/api/works/${jobId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) throw new Error("Failed to delete job");
            projectDiv.remove(); // remove from modal immediately
            removeFromGallery(jobId); // also remove from main gallery
        })
        .catch(error => console.error("Error deleting job:", error));
}

//Remove From Main Gallery

function removeFromGallery(jobId) {
    jobCache = jobCache.filter(job => job.id != jobId);
    displayProjects(jobCache);
}

// Handle Form Submission
const addProjectForm = document.getElementById("add-project-form");
const formError = document.getElementById("form-error");

addProjectForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Collect data
    const image = document.getElementById("image").files[0];
    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;

    // Validate fields
    if (!image || !title || !category) {
        formError.style.display = "block";
        return;
    }
    formError.style.display = "none";

    // Prepare FormData
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("category", category);

    // Send POST request
    const token = localStorage.getItem("token");
    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData
    })
        .then(response => {
            if (!response.ok) throw new Error("Failed to add project");
            return response.json();
        })
        .then(newProject => {
            // Update jobCache and gallery
            jobCache.push(newProject);
            displayProjects(jobCache);

            // Reset form
            addProjectForm.reset();

            // Optional: close modal after adding
            closeModal();
        })
        .catch(error => console.error("Error adding project:", error));
});


// Add a button function to switch between modals
//Added Variables 
const openFormBtn = document.getElementById("open-form-btn");
const modalGallery = document.getElementById("modal-gallery");
const modalForm = document.getElementById("modal-form");
const backToGalleryBtn = document.getElementById("back-to-gallery");

//Add Event Listeners
openFormBtn.addEventListener("click", () => {
    modalGallery.classList.add("hidden");
    modalForm.classList.remove("hidden");
    document.querySelector(".back-button").classList.remove("hidden");
});

backToGalleryBtn.addEventListener("click", () => {
    modalForm.classList.add("hidden");
    modalGallery.classList.remove("hidden");
    document.querySelector(".back-button").classList.add("hidden");
    
});

// IMAGE PREVIEW
const imageInput = document.getElementById("image");
const imagePreview = document.getElementById("image-preview");

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => {
            imagePreview.src = e.target.result;
            imagePreview.style.display = "block";
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.style.display = "none";
    }
});
