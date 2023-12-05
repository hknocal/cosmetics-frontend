document.addEventListener('DOMContentLoaded', async function () {
    //const apiUrl = 'http://localhost:8080';
    const apiUrl = 'https://cosmeticsbackend.azurewebsites.net';
    const userCreationForm = document.getElementById('userCreationForm');
    const userCreationMessage = document.getElementById('userCreationMessage');
    const tokenDisplay = document.getElementById('tokenDisplay');
    const logoutBtn = document.getElementById('logoutBtn');
    const userListBody = document.getElementById('userListBody');

    // Check if there is a token on page load for users.html access
    const storedToken = localStorage.getItem('jwtToken');
    if (window.location.pathname.includes('users') && !storedToken) {
        window.location.href = 'index.html';
    }

    // Display the token on the users.html page if available
    if (tokenDisplay && storedToken) {
        tokenDisplay.textContent = `JWT Token: ${storedToken}`;
    }

    // Fetch and display user data
    async function fetchUsers() {
        try {
            const response = await fetch(`${apiUrl}/users`, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`
                }
            });

            if (response.ok) {
                const users = await response.json();
                renderUserList(users);
            } else {
                console.error('Error fetching user data:', response.statusText);
            }
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    }

    function renderUserList(users) {
        userListBody.innerHTML = ''; // Clear existing content
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>
                    <button class="btn btn-danger delete-btn" data-username="${user.username}">Delete</button>
                </td>
            `;
            userListBody.appendChild(row);
        });
    }

    // Add an event listener for clicks on the table body
    userListBody.addEventListener('click', async function (event) {
        const target = event.target;

        // Check if the clicked element is a delete button
        if (target.classList.contains('delete-btn')) {
            const username = target.dataset.username;
            const confirmed = confirm('Are you sure you want to delete this user?');

            if (confirmed) {
                // Call the function to delete the user
                deleteUser(username);
            }
        }
    });

    // Function to delete the user by sending a DELETE request to the server
    async function deleteUser(username) {
        try {
            const response = await fetch(`${apiUrl}/deleteUser`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedToken}`
                },
                body: JSON.stringify({ username: username })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message); // Display the server's message in the console
                fetchUsers(); // Update the user list after deletion
            } else {
                console.error('Error deleting user:', response.statusText);
            }
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    }

    // Call fetchUsers to initially populate the user list
    fetchUsers();

    if (userCreationForm) {
        userCreationForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const newUsername = document.getElementById('newUsername').value;
            const newPassword = document.getElementById('newPassword').value;

            try {
                const response = await fetch(`${apiUrl}/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${storedToken}`
                    },
                    body: JSON.stringify({ username: newUsername, password: newPassword })
                });

                const data = await response.json();

                if (response.ok) {
                    userCreationMessage.textContent = data.message || 'User created successfully!';
                    // After creating a user, close the modal
                    $('#createUserModal').modal('hide');
                    // Refresh the user list
                    fetchUsers();
                } else {
                    userCreationMessage.textContent = data.message || 'Error creating user. Try again';
                }
            } catch (error) {
                console.error('Error during fetch:', error);
                userCreationMessage.textContent = 'An error occurred while processing your request.';
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem('jwtToken');
            window.location.href = 'index.html';
        });
    }
});
