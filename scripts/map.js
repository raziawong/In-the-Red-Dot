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

function renderZoneAndData(map, geoDistriSeries) {
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
            // 1. Click interaction to show area name and respective data
            // 2. Heat Map Color Region
        });
    }).addTo(map);

    let info = L.control({ position: 'bottomright' });
    info.onAdd = function(map) {
        let containerEle = L.DomUtil.create('div', 'info');
        let headerEle = L.DomUtil.create('h3', '', containerEle);
        let legendEle = L.DomUtil.create('div', 'legend', containerEle);

        containerEle.setAttribute('id', 'map-info');
        headerEle.innerHTML = '<h3>Population Density</h3>';

        legendEle.innerHTML = '<span>&nbsp;&nbsp;Low&nbsp;&nbsp;</span>';
        for (let color of MAP_COLOR_RANGE) {
            legendEle.innerHTML += '<i style="background:' + color + '"></i> ';
        }
        legendEle.innerHTML += '<span>&nbsp;&nbsp;High&nbsp;&nbsp;</span>';

        // let divEle = L.DomUtil.create('div', 'info legend');
        // let titleEle = L.DomUtil.create('div', 'title', divEle);
        // titleEle.innerHTML = '<div><h3>Population Density</h3>';

        // console.log(divEle);

        // divEle.innerHTML = '<span>&nbsp;&nbsp;Low&nbsp;&nbsp;</span>';
        // for (let color of MAP_COLOR_RANGE) {
        //     divEle.innerHTML += '<i style="background:' + color + '"></i> ';
        // }
        // divEle.innerHTML += '<span>&nbsp;&nbsp;High&nbsp;&nbsp;</span>';
        return containerEle;
    };
    info.addTo(map);

    // let viewLayers = {
    //     'areas': planAreaGroup,
    //     'subzones': subzoneGroup
    // }

    // toggleMapView(map, viewLayers, viewSelectEle.selectedOptions[0].value)
    // viewSelectEle.addEventListener('change', function(event) {
    //     toggleMapView(map, viewLayers, event.target.selectedOptions[0].value);
    // });
}