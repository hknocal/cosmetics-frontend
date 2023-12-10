document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = 'http://localhost:8080';
    //const apiUrl = 'https://cosmeticsbackend.azurewebsites.net';
    const treatmentSelect = document.getElementById("treatmentSelect");

    // Fetch treatments from the API
    fetch(`${apiUrl}/treatment`)
        .then((response) => response.json())
        .then((data) => {
            // Iterate over the list of treatments and populate the dropdown
            data.forEach((treatment) => {
                const option = document.createElement("option");
                option.value = treatment.treatmentType;
                option.text = `${treatment.treatmentType} - ${treatment.price} DKK (${treatment.duration} min)`;
                treatmentSelect.appendChild(option);
            });
        })
        .catch((error) => {
            console.error("Error fetching treatments:", error);
        });

    // Attach the confirmBooking function to the button click event if the button exists
    const confirmButton = document.getElementById('confirmButton');
    if (confirmButton) {
        confirmButton.addEventListener('click', () => confirmBooking());
    }
});

async function confirmBooking() {
    try {
        // Perform any additional client-side validation if needed
        const formData = getFormValues();

        // Example using fetch:
        const response = await fetch(`${apiUrl}/booking/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Booking confirmation failed: ${errorMessage}`);
        }

        // Handle success, e.g., show a success message
        console.log('Booking confirmed successfully');
    } catch (error) {
        // Handle errors, e.g., show an error message
        console.error('Error confirming booking:', error.message);
    }
}

function getFormValues() {
    // Retrieve form values as needed
    const treatmentId = document.getElementById('treatmentSelect').value;
    const date = document.getElementById('dateSelect').value;
    const time = document.getElementById('timeSelect').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const address = document.getElementById('address').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    return {
        treatmentId,
        date,
        time,
        firstName,
        lastName,
        address,
        email,
        phone
    };
}
