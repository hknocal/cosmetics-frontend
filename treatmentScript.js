document.addEventListener('DOMContentLoaded', async function () {
    //const apiUrl = 'http://localhost:8080';
    const apiUrl = 'https://cosmeticsbackend.azurewebsites.net';
    const treatmentCreationForm = document.getElementById('treatmentCreationForm');
    const treatmentCreationMessage = document.getElementById('treatmentCreationMessage');
    const logoutBtn = document.getElementById('logoutBtn');
    const treatmentListBody = document.getElementById('treatmentListBody');
    const storedToken = localStorage.getItem('jwtToken');
    if (window.location.pathname.includes('treatments') && !storedToken) {
        window.location.href = 'index.html';
    }

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
            row.innerHTML = `<td>${treatment.treatmentType}</td><td>${treatment.price}</td><td>${treatment.duration}</td><td>${treatment.discount}</td><td>
            <button class="btn btn-danger delete-btn" data-treatment-id="${treatment.id}">
                Delete
            </button>
        </td>`;
            treatmentListBody.appendChild(row);
        });
    }

    async function createTreatment(newTreatment) {
        try {
            const response = await fetch(`${apiUrl}/treatment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedToken}`
                },
                body: JSON.stringify(newTreatment)
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                fetchTreatments();
                // Clear the form after creating a treatment
                treatmentCreationForm.reset();
            } else {
                console.error('Error creating treatment:', response.statusText);
            }
        } catch (error) {
            console.error('Error during fetch:', error)
        }
    }

    async function deleteTreatment(treatmentId) {
        try {
            const response = await fetch(`${apiUrl}/deleteTreatment`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedToken}`
                },
                body: JSON.stringify({treatmentId: treatmentId})
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                fetchTreatments();
            } else {
                console.error('Error deleting treatment:', response.statusText);
            }
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    }

    treatmentListBody.addEventListener('click', async function (event) {
        const target = event.target;

        if (target.classList.contains('delete-btn')) {
            const treatmentId = target.dataset.treatmentId;
            const confirmed = confirm('Are you sure you want to delete this treatment?');

            if (confirmed) {
                try {
                    await deleteTreatment(treatmentId);
                } catch (error) {
                    console.error('Error during treatment deletion:', error);
                }

            }
        }
    });

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
                    $('#createTreatmentModal').modal('hide');
                    fetchTreatments();
                    treatmentCreationForm.reset();
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
