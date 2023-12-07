document.addEventListener('DOMContentLoaded', async function () {
    //const apiUrl = 'http://localhost:8080';
    const apiUrl = 'https://cosmeticsbackend.azurewebsites.net';
    const logoutBtn = document.getElementById('logoutBtn');
    const userListBody = document.getElementById('customerListBody');
    const createCustomerForm = document.getElementById('createCustomerForm');
    const createCustomerMessage = document.getElementById('createCustomerMessage');

    // Check if there is a token on page load for customer.html access
    const storedToken = localStorage.getItem('jwtToken');
    if (window.location.pathname.includes('customer') && !storedToken) {
        window.location.href = 'index.html';
    }

    // Function to create a customer
    async function createCustomer(newCustomerData) {
        try {
            const response = await fetch(`${apiUrl}/customer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedToken}`
                },
                body: JSON.stringify(newCustomerData)
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                fetchCustomers(); // Refresh the customer list after creating a customer
            } else {
                console.error('Error creating customer:', response.statusText);
                createCustomerMessage.textContent = 'Error creating customer. Try again';
            }
        } catch (error) {
            console.error('Error during fetch:', error);
            createCustomerMessage.textContent = 'An error occurred while processing your request.';
        }
    }

    // Function to fetch and display customer data
    async function fetchCustomers() {
        try {
            const response = await fetch(`${apiUrl}/customer`, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`
                }
            });

            if (response.ok) {
                const customers = await response.json();
                renderCustomerList(customers);
            } else {
                console.error('Error fetching customer data:', response.statusText);
            }
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    }

    function renderCustomerList(customers) {
        userListBody.innerHTML = ''; // Clear existing content
        customers.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${customer.customerId}</td>
                     <td>${customer.firstname}</td>
                     <td>${customer.lastname}</td>
                     <td>${customer.mail}</td>
                     <td>${customer.address}</td>
                     <td>${customer.phoneNumber}</td>
                     <td>
                        <button class="btn btn-danger delete-btn" data-customer-id="${customer.customerId}">Delete</button>
                     </td>`;
            userListBody.appendChild(row);
        });
    }

    // Event listener for the create customer form submission
    if (createCustomerForm) {
        createCustomerForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const createFirstName = document.getElementById('createFirstName').value;
            const createLastName = document.getElementById('createLastName').value;
            const createMail = document.getElementById('createMail').value;
            const createAddress = document.getElementById('createAddress').value;
            const createPhoneNumber = document.getElementById('createPhoneNumber').value;

            const newCustomerData = {
                firstname: createFirstName,
                lastname: createLastName,
                mail: createMail,
                address: createAddress,
                phoneNumber: createPhoneNumber
            };

            createCustomer(newCustomerData);
            $('#createCustomerModal').modal('hide'); // Close the modal after creating a customer
        });
    }

    // Event listener for delete buttons
    userListBody.addEventListener('click', async function (event) {
        if (event.target.classList.contains('delete-btn')) {
            const customerId = event.target.dataset.customerId;
            await deleteCustomer(customerId);
            fetchCustomers(); // Refresh the customer list after deletion
        }
    });

    // Function to delete a customer
    async function deleteCustomer(id) {
        try {
            const response = await fetch(`${apiUrl}/customer/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${storedToken}`
                }
            });

            if (!response.ok) {
                console.error('Error deleting customer:', response.statusText);
            }
        } catch (error) {
            console.error('Error during delete:', error);
        }
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem('jwtToken');
            window.location.href = 'index.html';
        });
    }

    // Call fetchCustomers to initially populate the customer list
    fetchCustomers();
});
