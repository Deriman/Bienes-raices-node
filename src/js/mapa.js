(function() {
    const lat = 42.6713956;
    const lng = -2.0578033;
    const mapa = L.map('mapa').setView([lat, lng ], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);


})()