document.addEventListener('DOMContentLoaded', async function () {
    //const apiUrl = 'http://localhost:8080';
    const apiUrl = 'https://cosmeticsbackend.azurewebsites.net';
    const logoutBtn = document.getElementById('logoutBtn');
    const bookingListBody = document.getElementById('bookingListBody');
    const storedToken = localStorage.getItem('jwtToken');

    if (window.location.pathname.includes('bookingadmin') && !storedToken) {
        window.location.href = 'index.html';
    }

    async function fetchBookings() {
        try {
            const response = await fetch(`${apiUrl}/booking/list`, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`
                }
            });

            if (response.ok) {
                const bookingDTOList = await response.json();
                renderBookingList(bookingDTOList);
            } else {
                console.error('Error fetching booking data:', response.statusText);
            }
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    }

    function renderBookingList(bookingDTOList) {
        bookingListBody.innerHTML = ''; // Clear existing content
        bookingDTOList.forEach(bookingDTO => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${bookingDTO.treatmentType}</td><td>${bookingDTO.firstName} ${bookingDTO.lastName}</td><td>${bookingDTO.appointmentTime}</td><td>
            <button class="btn btn-danger delete-btn" data-booking-id="${bookingDTO.id}">
                Delete
            </button>
        </td>`;
            bookingListBody.appendChild(row);
        });
    }

    async function deleteBooking(bookingId) {
        try {
            const response = await fetch(`${apiUrl}/booking/${bookingId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                fetchBookings();
            } else {
                console.error('Error deleting booking:', response.statusText);
            }
        } catch (error) {
            console.error('Error during booking deletion:', error);
        }
    }

    bookingListBody.addEventListener('click', async function (event) {
        const target = event.target;

        if (target.classList.contains('delete-btn')) {
            const bookingId = target.dataset.bookingId;
            const confirmed = confirm('Are you sure you want to delete this booking?');

            if (confirmed) {
                try {
                    await deleteBooking(bookingId);
                } catch (error) {
                    console.error('Error during booking deletion:', error);
                }
            }
        }
    });

    fetchBookings();

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem('jwtToken');
            window.location.href = 'index.html';
        });
    }
});
