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
    projectDiv.innerHTML = `
      <img src="${job.imageUrl}" alt="${job.title}">
      
    `;
    container.appendChild(projectDiv);
  });
}

function openModal() {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
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






