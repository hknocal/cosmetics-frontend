document.addEventListener("DOMContentLoaded", function () {
    //const apiUrl = 'http://localhost:8080';
    const apiUrl = 'https://cosmeticsbackend.azurewebsites.net';
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
});
