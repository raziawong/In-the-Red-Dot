function getHeatMapColor(highestNum, num) {
    let percentage = (highestNum - num) / highestNum * 100;
    return percentage > 90 ? '#ffffe5' :
        percentage > 80 ? '#fff7bc' :
        percentage > 70 ? '#fee391' :
        percentage > 50 ? '#fec44f' :
        percentage > 40 ? '#fe9929' :
        percentage > 30 ? '#ec7014' :
        percentage > 20 ? '#cc4c02' :
        percentage > 10 ? '#993404' :
        '#662506';
}

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
let populationNum = [];
async function handleMapLayers(map, geoDistriSeries) {
    let viewSelectEle = document.getElementById('map-view-select');
    let planAreaGroup = omnivore.kml(DATA_GOV_API.STORE_URL + '/2019_planarea.kml');

    planAreaGroup.on('ready', function() {
        map.fitBounds(planAreaGroup.getBounds());

        planAreaGroup.eachLayer(function(layer) {
            let properties = layer.feature.properties;
            let areaName = UTIL.convertToTitleCase(layer.feature.properties.PLN_AREA_N);

            for (let [type, data] of Object.entries(geoDistriSeries)) {
                for (let area in data) {
                    if (area.toLowerCase() == areaName.toLowerCase()) {
                        properties[type] = data[area];
                    }
                }
            }
            properties['population'] = properties['ageGroup']['Total'] || properties['ethnicGroup']['Total'];
            populationNum.push(properties.population);
            properties['display_name'] = areaName;

            layer.setStyle({
                fillColor: getHeatMapColor(geoDistriSeries.highestPopulationCount, properties['population']),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            });

            // TODO:
            // 1. Hover effect to show area name and respective data
            // 2. Heat Map Color Region
        });
    });

    let subzoneData = await getSubzoneLayerData();
    let subzoneGroup = L.layerGroup();
    let subzoneName = [];
    L.geoJson(subzoneData, {
        onEachFeature: function(feature, layer) {
            let dummyDiv = document.createElement('div');
            dummyDiv.innerHTML = feature.properties.Description;
            let name = dummyDiv.querySelectorAll('td')[1].innerHTML;
            feature.properties.subzone_name = UTIL.convertToTitleCase(name);
            subzoneName.push(feature.properties.subzone_name);
        }
    }).addTo(subzoneGroup);

    //console.log(subzoneName.sort(UTIL.compareAlphabetically));

    let viewLayers = {
        'areas': planAreaGroup,
        'subzones': subzoneGroup
    }

    toggleMapView(map, viewLayers, viewSelectEle.selectedOptions[0].value)
    viewSelectEle.addEventListener('change', function(event) {
        toggleMapView(map, viewLayers, event.target.selectedOptions[0].value);
    });
}