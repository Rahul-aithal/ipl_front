// Reference to the main container
const mainContainer = document.querySelector(".container1");

// Add Job Request Button
const addJobBtn = document.getElementById("addJobBtn");

// Fetch and display all jobs on page load
window.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("http://localhost:5000/jobs");
        if (response.ok) {
            const jobs = await response.json();
            jobs.forEach(job => {
                displayJob(job._id, job.jobDesc, job.email, job.salary);
            });
        } else {
            console.error("Failed to fetch jobs.");
        }
    } catch (error) {
        console.error("Error fetching jobs:", error);
    }
});

// Add Job Request Button Click Handler
addJobBtn.addEventListener("click", () => {
    // Hide the "Add Job Request" button while input is displayed
    addJobBtn.style.display = "none";

    // Create an input container
    const inputContainer = document.createElement("div");
    inputContainer.className = "input-container";

    inputContainer.innerHTML = `
        <input type="text" placeholder="Job Description" class="jobInput">
        <input type="text" placeholder="Contact Email" class="emailInput">
        <input type="text" placeholder="Total Pay in $" class="payInput">
        <button class="submit-btn">Submit</button>
    `;
    
    // Append the input container to the main container
    mainContainer.appendChild(inputContainer);

    // Handle form submission
    const submitBtn = inputContainer.querySelector(".submit-btn");
    submitBtn.addEventListener("click", async () => {
        // Get input values
        const jobDesc = inputContainer.querySelector(".jobInput").value;
        const email = inputContainer.querySelector(".emailInput").value;
        const pay = inputContainer.querySelector(".payInput").value;

        // Validate inputs
        if (!jobDesc || !email || !pay) {
            alert("Please fill out all fields.");
            return;
        }

        // Send data to the backend
        try {
            const response = await fetch("http://localhost:5000/jobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    jobDesc,
                    email,
                    salary: parseFloat(pay),
                }),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log("Backend Response:", responseData);

                // Display the new job
                displayJob(responseData.data._id, jobDesc, email, pay);

                // Remove the input container after submission
                inputContainer.remove();

                // Show the "Add Job Request" button again
                addJobBtn.style.display = "block";

                // Show success notification
                showSuccessNotification("Job Description Added Successfully!");
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            alert("Failed to submit job data. Please try again later.");
            console.error("Error:", error);
        }
    });
});

// Function to display a job
function displayJob(id, jobDesc, email, pay) {
    // Create a display container for the submitted data
    const displayContainer = document.createElement("div");
    displayContainer.className = "display-text";
    displayContainer.innerHTML = `
        <button class="delete-btn" title="Delete" data-id="${id}">&times;</button>
        <p><strong>Job Description:</strong> ${jobDesc}</p>
        <p><strong>Contact Email:</strong> ${email}</p>
        <p><strong>Total Pay:</strong> $${pay}</p>
    `;

    // Append the display container to the main container
    mainContainer.appendChild(displayContainer);

    // Add event listener to the delete button
    const deleteBtn = displayContainer.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", async () => {
        const jobId = deleteBtn.getAttribute("data-id");

        try {
            console.log({jobId});
            const response = await fetch(`http://localhost:5000/jobs/${jobId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                displayContainer.remove();
                showSuccessNotification("Job Deleted Successfully!");
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            alert("Failed to delete job. Please try again later.");
            console.error("Error:", error);
        }
    });
}

// Function to display success notification
function showSuccessNotification(message) {
    const notification = document.createElement("div");
    notification.className = "success-notification";
    notification.innerText = message;

    // Append notification to the main container
    mainContainer.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
