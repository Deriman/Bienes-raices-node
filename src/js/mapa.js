(function() {
    const lat = 42.671581927092234;
    const lng = -2.028511762619019;
    const mapa = L.map('mapa').setView([lat, lng ], 16);
    let marker;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // Pin en el mapa (se puede mover)
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    }).addTo(mapa)

    //Detectar movimiento del pin
    marker.on('moveend', function(e){
        marker = e.target;
        const position = marker.getLatLng();
        console.log({position})
        mapa.panTo(new L.LatLng(position.lat, position.lng))
    })

})()