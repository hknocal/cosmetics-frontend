document.addEventListener('DOMContentLoaded', async function () {
   // const apiUrl = 'http://localhost:8080';
    const apiUrl = 'https://cosmeticsbackend.azurewebsites.net';
    const logoutBtn = document.getElementById('logoutBtn');
    const userListBody = document.getElementById('customerListBody');
    const createCustomerForm = document.getElementById('createCustomerForm');
    const createCustomerMessage = document.getElementById('createCustomerMessage');

    const storedToken = localStorage.getItem('jwtToken');
    if (window.location.pathname.includes('customer') && !storedToken) {
        window.location.href = 'index.html';
    }

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
                fetchCustomers();
            } else {
                console.error('Error creating customer:', response.statusText);
                createCustomerMessage.textContent = 'Error creating customer. Try again';
            }
        } catch (error) {
            console.error('Error during fetch:', error);
            createCustomerMessage.textContent = 'An error occurred while processing your request.';
        }
    }

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
                return customers;
            } else {
                console.error('Error fetching customer data:', response.statusText);
            }
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    }

    function renderCustomerList(customers) {
        userListBody.innerHTML = '';
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

            const updateButtons = document.querySelectorAll('.update-btn');
            updateButtons.forEach(button => {
                button.addEventListener('click', async function (event) {
                    const customerId = event.target.dataset.customerId;
                    const customers = await fetchCustomers();

                    const customer = customers.find(c => c.customerId === parseInt(customerId));

                    if (customer) {
                        displayUpdateForm(customer);
                    }
                });
            });
        });
    }

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
                    await fetchCustomers();
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

    userListBody.addEventListener('click', async function (event) {
        if (event.target.classList.contains('delete-btn')) {
            const customerId = event.target.dataset.customerId;
            await deleteCustomer(customerId);
            await fetchCustomers();
        }
    });

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

    await fetchCustomers();
});
