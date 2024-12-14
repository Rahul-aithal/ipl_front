// Function to read the CSV file
function readCSV(file, callback) {
  const reader = new FileReader();
  reader.onload = function(event) {
      const content = event.target.result;
      const rows = content.split('\n');
      const data = rows.map(row => row.split(','));
      callback(data);
  };
  reader.readAsText(file);
}

// Function to verify the credentials
function verifyLogin(data, email, password) {
  for (let i = 1; i < data.length; i++) { // Start from 1 to skip the header row
      const [username, userEmail, userPassword] = data[i];
      if (userEmail === email && userPassword === password) {
          return true; // Credentials match
      }
  }
  return false; // No match found
}

// Handle form submission
document.getElementById('sign-in-button').addEventListener('click', function() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Fetch the CSV file
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.csv';
  
  fileInput.addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file) {
          readCSV(file, function(data) {
              const isValid = verifyLogin(data, email, password);
              if (isValid) {
                  alert('Login successful!');
                  // Redirect to the main page (IPL.html)
                  window.location.href = 'IPL.html'; // Redirect to the main page
              } else {
                  alert('Invalid email or password!');
              }
          });
      }
  });

  fileInput.click(); // Trigger file selection dialog
});
