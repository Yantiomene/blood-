const L = require('leaflet-headless');
const fetch = require('node-fetch');


const hospitals = [
    { name: 'Hospital 1', address: '123 Main St, City 1, Country 1' },
    { name: 'Hospital 2', address: '456 Oak St, City 2, Country 2' },
    // Add more hospitals as needed
  ];
  
  // Create an array to store hospital markers
  const hospitalMarkers = [];
  
  // Function to generate hospital markers and add them to the map
const generateHospitalMarkers = (hospital) => {
    const marker = L.marker([0, 0]) // Placeholder coordinates, as headless leaflet does not require real coordinates
      .bindPopup(`<strong style="color: #d9534f;">${hospital.name}</strong><br>${hospital.address}`);
    hospitalMarkers.push(marker);
};
  
// Iterate through hospitals and generate markers
hospitals.forEach(generateHospitalMarkers);
  
// Function to handle hover over hospital marker
const handleMarkerHover = (marker) => {
    console.log(marker.getPopup().getContent());
};
  
// Add event listeners to hospital markers
hospitalMarkers.forEach(marker => handleMarkerHover(marker));
  
// Inside the loop where you send emails, add the hospital markers to the HTML email
const hospitalsInEmail = hospitalMarkers.map(marker => `<li>${marker.getPopup().getContent()}</li>`).join('');

console.log(hospitalsInEmail);