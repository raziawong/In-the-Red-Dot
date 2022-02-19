const MAP_COLOR_RANGE = ['#ffffe5', '#fff7bc', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#993404', '#662506'];

function getHeatMapColor(highestNum, num) {
    let percentage = (highestNum - num) / highestNum * 100;
    return percentage > 90 ? MAP_COLOR_RANGE[0] :
        percentage > 80 ? MAP_COLOR_RANGE[1] :
        percentage > 70 ? MAP_COLOR_RANGE[2] :
        percentage > 50 ? MAP_COLOR_RANGE[3] :
        percentage > 40 ? MAP_COLOR_RANGE[4] :
        percentage > 30 ? MAP_COLOR_RANGE[5] :
        percentage > 20 ? MAP_COLOR_RANGE[6] :
        percentage > 10 ? MAP_COLOR_RANGE[7] :
        MAP_COLOR_RANGE[8];
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
            properties['display_name'] = areaName;

            layer.setStyle({
                fillColor: getHeatMapColor(geoDistriSeries.highestPopulationCount, properties['population']),
                weight: 2,
                opacity: 1,
                color: 'grey',
                dashArray: '4',
                fillOpacity: 0.7
            });

            // TODO:
            // 1. Hover effect to show area name and respective data
            // 2. Heat Map Color Region
        });
    });

    let legend = L.control({ position: 'bottomright' });
    legend.onAdd = function(map) {
        let divEle = L.DomUtil.create('div', 'info legend');

        divEle.innerHTML = '<span>&nbsp;&nbsp;Low&nbsp;&nbsp;</span>';
        for (let color of MAP_COLOR_RANGE) {
            divEle.innerHTML += '<i style="background:' + color + '"></i> ';
        }
        divEle.innerHTML += '<span>&nbsp;&nbsp;High&nbsp;&nbsp;</span>';
        return divEle;
    };
    legend.addTo(map);

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