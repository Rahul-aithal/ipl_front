// Function to create or update the CSV file
function updateCSV(username, email, password) {
    const headers = 'Username,Email,Password\n'; // Define the CSV headers
    const newRow = `${username},${email},${password}\n`; // Add new user data as a row

    // Check if the CSV file already exists (localStorage simulation)
    const existingCSV = localStorage.getItem('userCSV');
    
    if (existingCSV) {
        // If CSV exists, append the new row
        const updatedCSV = existingCSV + newRow;
        localStorage.setItem('userCSV', updatedCSV); // Store updated CSV
    } else {
        // If no CSV exists, create a new one with headers and the first row of data
        localStorage.setItem('userCSV', headers + newRow);
    }
}

// Handle form submission
document.getElementById('submit-button').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Update or create the CSV file with the new user details
    updateCSV(username, email, password);

    alert('User signed up successfully!');
    // Optionally, redirect to the sign-in page or dashboard
    window.location.href = 'Sign-in.html'; // Replace with your sign-in or home page
});
