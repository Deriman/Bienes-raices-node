(function() {
    const lat = 42.6713956;
    const lng = -2.0578033;
    const mapa = L.map('mapa').setView([lat, lng ], 13);
    let marker;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // Pin en el mapa (se puede mover, y se centra sobre él)
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    }).addTo(mapa)

})()