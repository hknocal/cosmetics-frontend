document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = 'http://localhost:8080';
    //const apiUrl = 'https://cosmeticsbackend.azurewebsites.net';
    const treatmentSelect = document.getElementById("treatmentSelect");

    const bookingForm = document.getElementById("bookingForm");
    bookingForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Gather form data
        const selectedTreatment = treatmentSelect.value.split(" - ")[0];

        const date = document.getElementById("dateSelect").value;
        const time = document.getElementById("timeSelect").value;
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const address = document.getElementById("address").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;

        // Create a BookingDTO object
        const bookingData = {
            treatmentType: selectedTreatment,
            firstName: firstName,
            lastName: lastName,
            mail: email,
            address: address,
            phoneNumber: phone,
            appointmentTime: `${date}T${time}:00`
        };



        // Send the booking data to the server
        fetch(`${apiUrl}/booking/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        })
            .then((response) => {
                if (response.ok) {
                    // Booking successful, you can add code to handle success here
                    alert("Booking successful!");
                    bookingForm.reset();
                } else {
                    // Booking failed, handle the error here
                    alert("Booking failed. Please try again.");
                }
            })
            .catch((error) => {
                console.error("Error submitting booking:", error);
            });
    });

    // Fetch treatments from the API and populate the dropdown (unchanged)
    fetch(`${apiUrl}/treatment`)
        .then((response) => response.json())
        .then((data) => {
            data.forEach((treatment) => {
                const option = document.createElement("option");
                option.value = `${treatment.treatmentType} - ${treatment.price} DKK (${treatment.duration} min)`;
                option.text = `${treatment.treatmentType} - ${treatment.price} DKK (${treatment.duration} min)`;
                treatmentSelect.appendChild(option);
            });
        })
        .catch((error) => {
            console.error("Error fetching treatments:", error);
        });
});
