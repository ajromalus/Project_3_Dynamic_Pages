// API endpoint URL for the architect's projects
const apiURL = "http://localhost:5678/api/works";
const categoriesURL = "http://localhost:5678/api/categories";

const jobCache = []
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
// Function to handle the filter button click
function displayCategories(categories) {
    const categoriesContainer = document.querySelector(".categories");
    // categoriesContainer.innerHTML = ""; 
// Create filter buttons dynamically
    const allBtn = document.createElement("button");
    allBtn.textContent = "All";
    allBtn.classList.add("filter-btn");
    categoriesContainer.appendChild(allBtn);


    categories.forEach(category => {
        const btn = document.createElement("button");
        btn.textContent = category.name;
        btn.classList.add("filter-btn");
        btn.dataset.id = category.id;
        categoriesContainer.appendChild(btn);

        
    });
    

}

// Create CSS for buttons




