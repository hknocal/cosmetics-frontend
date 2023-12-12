document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = 'http://localhost:8080';
    //const apiUrl = 'https://cosmeticsbackend.azurewebsites.net';
    const treatmentSelect = document.getElementById("treatmentSelect");
    const bookingForm = document.getElementById("bookingForm");

    fetch(`${apiUrl}/treatment`)
        .then((response) => response.json())
        .then((data) => {
            data.forEach((treatment) => {
                const option = document.createElement("option");
                option.value = `${treatment.treatmentType} - ${treatment.price} kr (${treatment.duration} min)`;
                option.text = `${treatment.treatmentType} - ${treatment.price} kr (${treatment.duration} min)`;
                treatmentSelect.appendChild(option);
            });
        })
        .catch((error) => {
            console.error("Error fetching treatments:", error);
        });

    bookingForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const selectedTreatment = treatmentSelect.value.split(" - ")[0];
        const date = document.getElementById("dateSelect").value;
        const time = document.getElementById("timeSelect").value;
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const address = document.getElementById("address").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;

        const bookingData = {
            treatmentType: selectedTreatment,
            firstName: firstName,
            lastName: lastName,
            mail: email,
            address: address,
            phoneNumber: phone,
            appointmentTime: `${date}T${time}:00`
        };

        fetch(`${apiUrl}/booking/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        })
            .then((response) => {
                if (response.ok) {
                    // Show success modal
                    $('#successModal').modal('show');
                    bookingForm.reset();
                } else {
                    // Show error modal
                    $('#errorModal').modal('show');
                }
            })
            .catch((error) => {
                console.error("Error submitting booking:", error);
            });
    });

});
