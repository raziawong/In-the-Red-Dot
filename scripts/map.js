function toggleMapView(map, viewLayers, value) {
    let planAreaGroup = viewLayers.areas;
    let subzoneGroup = viewLayers.subzones;

    if (map.hasLayer(planAreaGroup)) {
        map.removeLayer(planAreaGroup);
    }

    if (map.hasLayer(subzoneGroup)) {
        map.removeLayer(planAreaGroup);
    }

    if (value === 'area') {
        map.addLayer(planAreaGroup);
    } else if (value === 'subzone') {
        map.addLayer(subzoneGroup);
    }
}

async function handleMapLayers(map) {
    let viewSelectEle = document.getElementById('map-view-select');
    let planAreaGroup = omnivore.kml(DATA_GOV_API.STORE_URL + '/2019_planarea.kml').on('ready',
        function() {
            map.fitBounds(planAreaGroup.getBounds());
        }
    );

    let subzoneData = await getSubzoneLayerData();
    let subzoneGroup = L.layerGroup();
    L.geoJson(subzoneData, {
        onEachFeature: function(feature, layer) {}
    }).addTo(subzoneGroup);

    let viewLayers = {
        'areas': planAreaGroup,
        'subzones': subzoneGroup
    }

    toggleMapView(map, viewLayers, viewSelectEle.selectedOptions[0].value)
    viewSelectEle.addEventListener('change', function(event) {
        toggleMapView(map, viewLayers, event.target.selectedOptions[0].value);
    });
}