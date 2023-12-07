document.addEventListener('DOMContentLoaded', async function () {
    //const apiUrl = 'http://localhost:8080';
    const apiUrl = 'https://cosmeticsbackend.azurewebsites.net';
    const tokenDisplay = document.getElementById('tokenDisplay');
    const logoutBtn = document.getElementById('logoutBtn');
    const userListBody = document.getElementById('customerListBody');

    // Check if there is a token on page load for customer.html access
    const storedToken = localStorage.getItem('jwtToken');
    if (window.location.pathname.includes('customer') && !storedToken) {
        window.location.href = 'index.html';
    }

    // Display the token on the customer.html page if available
    if (tokenDisplay && storedToken) {
        tokenDisplay.textContent = `JWT Token: ${storedToken}`;
    }

    // Fetch and display customer data
    async function fetchCustomers() {
        try {
            const response = await fetch(`${apiUrl}/customer`, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`
                }
            });

            if (response.ok) {
                const customers = await response.json();
                renderCustomerList(customers)
                return customers;
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
                        <button class="btn btn-primary update-btn" data-customer-id="${customer.customerId}">Update</button>
                     </td>`;
            userListBody.appendChild(row);

            // Add event listener for update buttons
            const updateButtons = document.querySelectorAll('.update-btn');
            updateButtons.forEach(button => {
                button.addEventListener('click', async function (event) {
                    const customerId = event.target.dataset.customerId;
                    const customers = await fetchCustomers();

                    // Find the customer with the matching ID
                    const customer = customers.find(c => c.customerId === parseInt(customerId));

                    if (customer) {
                        displayUpdateForm(customer);
                    }
                });
            });
        });
    }

    function displayUpdateForm(customer) {
        const updateFirstName = document.getElementById('updateFirstName');
        const updateLastName = document.getElementById('updateLastName');
        const updateMail = document.getElementById('updateMail');
        const updateAddress = document.getElementById('updateAddress');
        const updatePhoneNumber = document.getElementById('updatePhoneNumber');

        updateFirstName.value = customer.firstname;
        updateLastName.value = customer.lastname;
        updateMail.value = customer.mail;
        updateAddress.value = customer.address;
        updatePhoneNumber.value = customer.phoneNumber;

        $('#updateCustomerModal').modal('show');

        updateCustomerForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const updatedCustomerData = {
                firstname: updateFirstName.value,
                lastname: updateLastName.value,
                mail: updateMail.value,
                address: updateAddress.value,
                phoneNumber: updatePhoneNumber.value
            };

            try {
                const response = await fetch(`${apiUrl}/customer/${customer.customerId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${storedToken}`
                    },
                    body: JSON.stringify(updatedCustomerData)
                });

                if (response.ok) {
                    await fetchCustomers(); // Refresh the customer list after updating
                } else {
                    updateCustomerMessage.textContent = 'Error updating customer. Try again';
                }
            } catch (error) {
                updateCustomerMessage.textContent = 'Error updating customer. Try again';
            }

            // Close the modal after updating
            $('#updateCustomerModal').modal('hide');
        });
    }

    // Call fetchCustomers to initially populate the customer list
    fetchCustomers();

    // Add event listener for delete buttons
    userListBody.addEventListener('click', async function (event) {
        if (event.target.classList.contains('delete-btn')) {
            const customerId = event.target.dataset.customerId;
            await deleteCustomer(customerId);
            await fetchCustomers(); // Refresh the customer list after deletion
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
});






