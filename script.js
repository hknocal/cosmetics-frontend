document.addEventListener('DOMContentLoaded', function () {
    //const apiUrl = 'http://localhost:8080';
    const apiUrl = 'https://cosmeticsbackend.azurewebsites.net';
    const loginForm = document.querySelector('.form-signin');
    const errorMessage = document.getElementById('errorMessage');
    const tokenDisplay = document.getElementById('tokenDisplay');
    const logoutBtn = document.getElementById('logoutBtn');

    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${apiUrl}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('jwtToken', data.token);
                    window.location.href = 'dashboard.html';
                } else {
                    errorMessage.textContent = data.message || 'Invalid credentials';
                    errorMessage.classList.add('alert', 'alert-danger');
                }
            } catch (error) {
                errorMessage.textContent = 'An error occurred while processing your request.';
                errorMessage.classList.add('alert', 'alert-danger');
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem('jwtToken');
            window.location.href = 'index.html';
        });
    }

    // Check if there is a token on page load for dashboard access
    const storedToken = localStorage.getItem('jwtToken');
    if (window.location.pathname.includes('dashboard') && !storedToken) {
        window.location.href = 'index.html';
    }

    // Display the token on the dashboard if available
    if (tokenDisplay && storedToken) {
        tokenDisplay.textContent = `JWT Token: ${storedToken}`;
    }
});
