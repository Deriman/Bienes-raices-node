(function() {
    const lat = 42.671581927092234;
    const lng = -2.028511762619019;
    const mapa = L.map('mapa').setView([lat, lng ], 16);
    let marker;
    // Utilizar Provider y Geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();

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
        console.log(position)
        mapa.panTo(new L.LatLng(position.lat, position.lng))

        // Obtener la información de las calles al soltar el pin
        geocodeService.reverse().latlng(position, 16).run(function(error, result){
            marker.bindPopup(result.address.LongLabel)
            document.querySelector('.calle').textContent = result?.address?.Address ?? ''
            document.querySelector('#calle').value = result?.address?.Address ?? ''
            document.querySelector('#lat').value = result?.latlng?.lat ?? ''
            document.querySelector('#lng').value = result?.latlng?.lng ?? ''
        })
    })

})()