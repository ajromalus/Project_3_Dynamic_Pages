// API endpoint URL for the architect's projects
const apiURL = "http://localhost:5678/api/works";

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
// Function to handle the filter button click
// Make another API call to retrieve the filtered projects?
// Fetch categories using request URL
// Create filter buttons dynamically
// Create CSS for buttons




