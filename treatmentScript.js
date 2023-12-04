document.addEventListener('DOMContentLoaded', async function () {
    //const apiUrl = 'http://localhost:8080';
    const apiUrl = 'https://cosmeticsbackend.azurewebsites.net';
    const treatmentCreationForm = document.getElementById('treatmentCreationForm');
    const treatmentCreationMessage = document.getElementById('treatmentCreationMessage');
    const tokenDisplay = document.getElementById('tokenDisplay');
    const logoutBtn = document.getElementById('logoutBtn');
    const treatmentListBody = document.getElementById('treatmentListBody');

    // Check if there is a token on page load for treatments.html access
    const storedToken = localStorage.getItem('jwtToken');
    if (window.location.pathname.includes('treatments') && !storedToken) {
        window.location.href = 'index.html';
    }

    // Display the token on the treatments.html page if available
    if (tokenDisplay && storedToken) {
        tokenDisplay.textContent = `JWT Token: ${storedToken}`;
    }

    // Fetch and display treatment data
    async function fetchTreatments() {
        try {
            const response = await fetch(`${apiUrl}/treatment`, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`
                }
            });

            if (response.ok) {
                const treatments = await response.json();
                renderTreatmentList(treatments);
            } else {
                console.error('Error fetching treatment data:', response.statusText);
            }
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    }

    function renderTreatmentList(treatments) {
        treatmentListBody.innerHTML = ''; // Clear existing content
        treatments.forEach(treatment => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${treatment.treatmentType}</td><td>${treatment.price}</td><td>${treatment.duration}</td><td>${treatment.discount}</td>`;
            treatmentListBody.appendChild(row);
        });
    }

    // Call fetchTreatments to initially populate the treatment list
    fetchTreatments();

    if (treatmentCreationForm) {
        treatmentCreationForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const treatmentType = document.getElementById('treatmentType').value;
            const treatmentPrice = document.getElementById('treatmentPrice').value;
            const treatmentDuration = document.getElementById('treatmentDuration').value;
            const treatmentDiscount = document.getElementById('treatmentDiscount').value;

            try {
                const response = await fetch(`${apiUrl}/treatment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${storedToken}`
                    },
                    body: JSON.stringify({
                        treatmentType: treatmentType,
                        price: treatmentPrice,
                        duration: treatmentDuration,
                        discount: treatmentDiscount
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    treatmentCreationMessage.textContent = data.message || 'Treatment created successfully!';
                    // After creating a treatment, close the modal
                    $('#createTreatmentModal').modal('hide');
                    // Refresh the treatment list
                    fetchTreatments();
                } else {
                    treatmentCreationMessage.textContent = data.message || 'Error creating treatment. Try again';
                }
            } catch (error) {
                console.error('Error during fetch:', error);
                treatmentCreationMessage.textContent = 'An error occurred while processing your request.';
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
